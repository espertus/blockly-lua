/**
 * Blockly Lua: ComputerCraft DependentInputBlock class
 *
 * Copyright 2013 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Class for ComputerCraft blocks having a dropdown input
 *     that controls whether a dependent value input is present.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.provide('ComputerCraft.DependentInputBlock');

goog.require('goog.asserts');
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.InputAddType = {
  NEVER: 0,  // Later code assumes that NEVER is 0, so do not change.
  FIRST: 1,
  ALL: 2
};

Blockly.ComputerCraft.ControllingInputCodeGenType = {
  // Never generate code for the controlling input.
  // This is the default value for DependentInputBlock.
  NEVER: 0,
  // Always generate code for the controlling input.
  ALWAYS: 1,
  // Only generate code if the dependent input is not shown.
  ONLY_IF_DEP_HIDDEN: 2
};

/**
 * Class for ComputerCraft blocks that have an input that only appears if
 * a dropdown menu has a specific value.
 *
 * While additional unrelated inputs not included in info.args or referenced in
 * info.text may be added, those fields must not be modified after block
 * construction.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     In addition to the fields used for the parent class
 *     Blockly.ComputerCraft.ValueBlock:
 *     <ul>
 *     <li>ddTitle {!string} Name of dropdown that controls whether
 *         dependent value input appears.
 *     <li>ddValue {!string} Value of dropdown when dependent value input
 *         appears.  This must not be the first option.
 *     <li>depName {!string} Name of dependent value input.
 *     <li>depType {?Array.<string>|string} Type of dependent value input.
 *     <li>depTitle {?string} Optional text to appear before dependent input
 *         only when it is shown.
 *     <li>addChild {?Blockly.ComputerCraft.InputAddTypes} Whether to
 *         automatically add and attach an input block when the dependent input
 *         is added.  This can only be done if depType is 'String' or 'Number'.
 *     <li>codeGenType {?Blockly.ComputerCraft.ControllingInputCodeGenType}
 *         Whether to generate argument code for the controlling dropdown input.
 *         If not defined, this defaults to NEVER.
 *     </ul>
 * @return {Blockly.ComputerCraft.DependentInputBlock} The new block.
 */
Blockly.ComputerCraft.DependentInputBlock = function(prefix, colour, info) {
  Blockly.ComputerCraft.DependentInputBlock.superClass_.constructor.call(
    this, prefix, colour, info);

  // Unless otherwise specified, only create a child string the first time the
  // dependent input is shown.
  if (typeof info.addChild == 'undefined') {
    info.addChild = Blockly.ComputerCraft.InputAddType.FIRST;
  }

  // Make sure that codeGenType is set.
  if (typeof(info.codeGenType) == 'undefined') {
    info.codeGenType =
        Blockly.ComputerCraft.ControllingInputCodeGenType.NEVER;
  }
};

goog.inherits(Blockly.ComputerCraft.DependentInputBlock,
    Blockly.ComputerCraft.ValueBlock);

Blockly.ComputerCraft.DependentInputBlock.DD_MARKER = '*';
Blockly.ComputerCraft.DependentInputBlock.DEP_MARKER = '^';

/**
 * Sets the following attributes on the argument if not already set:
 * - ddName: The name of the dropdown that controls the dependent input.
 *   This is determined by finding which input name ends with the character
 *   DD_MARKER.
 * - ddValue: The value of the dropdown that indicates that the dependent input
 *   should be enabled.  This is determined by finding which dropdown value
 *   ends with the character DD_MARKER.
 * - depName: The name of the dependent input.  This is determined by finding
 *   which input name ends with the character DEP_MARKER.
 * - depType: The type of the dependent Input.  This is determined by the type
 *   associated with depName.
 *
 * This method has no effect if info.ddName or info.depName is already defined
 * (besides asserting that, if one is set, both are).
 *
 * @param {!object} info An object with an args attribute whose value is an
 *   array of two-element tuples, each of which represents an input.
 *
 *   The first element of each tuple is a string giving the input name.
 *
 *   The second element is either:
 *   - the string name of a type (such as 'String' or 'Number'), or
 *   - an array of dropdown choices: two-element tuples where the first element
 *     is the displayed string and the second element the language-independent
 *     value. The name of one dropdown menu input should end with DD_MARKER, as
 *     should the name of whichever of the dropdown menu's values enables the
 *     dependent input.  Similarly, the name of the dependent input should end
 *     with DEP_MARKER.  These markers are stripped off.  It is an error for
 *     more than one input to have a DD_MARKER or for more than one to have a
 *     DEP_MARKER.
 *
 *   A sample value for info.args is:
 *     [['CHOICE*',
 *      [['current time', 'current'],
 *       ['time...', 'time*']]],
 *      ['TIME^', 'Time']]
 *   This indicates that there are two possible inputs.  The CHOICE dropdown
 *   input will always be shown.  If it has the value "time", the second TIME
 *   input will also be shown.
 */
Blockly.ComputerCraft.DependentInputBlock.setDependenceInfo_ =
    function(info) {
      // Skip if the attributes have already been defined.
      if (!info.ddName && !info.depName) {
        // Define short names for convenience and code clarity.
        var ddMarker = Blockly.ComputerCraft.DependentInputBlock.DD_MARKER;
        var depMarker = Blockly.ComputerCraft.DependentInputBlock.DEP_MARKER;
        for (var i = 0; i < info.args.length; i++) {
          var arg = info.args[i];
          var name = arg[0];
          if (name) {
            if (name.charAt(name.length - 1) == ddMarker) {
              goog.asserts.assert(!info.ddName,
                'info.ddName is being redefined.');
              arg[0] = name.slice(0, -1);
              info.ddName = arg[0];
              for (var j = 0; j < arg[1].length; j++) {
                var choice = arg[1][j];
                var choiceName = choice[1];
                if (choiceName.charAt(choiceName.length - 1) == ddMarker) {
                  goog.asserts.assert(!info.ddValue,
                    'info.ddValue is being redefined.');
                  choice[1] = choiceName.slice(0, -1);
                  info.ddValue = choice[1];
                }
              }
              goog.asserts.assert(info.ddValue,
                'No enabling value was found in dropdown ', info.ddName);
            } else if (name.charAt(name.length - 1) == depMarker) {
              goog.asserts.assert(!info.depName,
                'info.depName is being redefined.');
              arg[0] = name.slice(0, -1);
              info.depName = arg[0];
              goog.asserts.assert(typeof arg[1] == 'string',
                'Dependent inputs must be simple types.');
              info.depType = arg[1];
            }
          }
        }
      }

      // Validate the attributes, even if we didn't modify them.
      if (info.ddName) {
        goog.asserts.assert(info.depName,
          'A controlling dropdown menu was defined but not a dependent input.');
      } else {
        goog.assert.assert(!info.depName,
          'A dependent input was defined but not a controlling dropdown menu.');
      }
    };

/**
 * Create a block whose inputs that has a "dependent" value input that is only
 * shown if an associated dropdown menu has a certain value.
 *
 * There are two ways to specify the connection between the dropdown menu and
 * the dependent input.  The first is to define the ddName, ddValue, depName,
 * and depValue attributes of info, as described in the constructor above.
 * The second, more compact, way is to mark the dropdown input, the choice
 * that controls the dependent input, and the dependent input, as described
 * in setDependenceInfo_() above.  Because that method mutates info, be
 * careful not to pass in shared data (specifically, dropdown menu
 * descriptions).
 *
 * This method also creates a Lua code generator.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} info Information about the block being defined.
 * @return {Blockly.ComputerCraft.DependentInputBlock} The new block.
 */
Blockly.ComputerCraft.buildDependentInputBlock = function(
  prefix, colour, info) {
  Blockly.ComputerCraft.DependentInputBlock.setDependenceInfo_(info);
  var newBlock = new Blockly.ComputerCraft.DependentInputBlock(
    prefix, colour, info);
  Blockly.Blocks[newBlock.blockName] = newBlock;

  if (!info.suppressLua) {
    Blockly.Lua[newBlock.blockName] = Blockly.ComputerCraft.generateLua;
  }
  return newBlock;
};

Blockly.ComputerCraft.DependentInputBlock.prototype.init = function() {
  // Create the dropdown inputs without mutating args.
  // That way, init() can be rerun without error.
  var args = []
  for (var i = 0; i < this.info.args.length; i++) {
    var tuple = this.info.args[i];
    if (typeof tuple[1] == 'string') {
      args.push(tuple);
      if (tuple[0] == this.info.depName &&
          this.info.text.indexOf('%0') == -1) {
        // This mutates this.info.text if it has not yet been mutated
        // to add a dummy input (on which preceding titles can be hung)
        // and the dependent input's title before the dependent input.
        var re = new RegExp('%' + (i + 1) + '(?=(\\D|$))');
        var sub = '%0 ' + (this.info.depTitle || '') + ' %' + (i + 1);
        this.info.text = this.info.text.replace(re, sub);
      }
    } else {
      var newTuple = []
      newTuple[0] = tuple[0];
      // Current tuple represents a dropdown menu.
      if (newTuple[0] == this.info.ddName) {
        // It's the input that controls the dependent input.
        var thisBlock = this;
        newTuple[1] = new Blockly.FieldDropdown(
          tuple[1],
          function(value) {
            if (value == thisBlock.info.ddValue) {
              if (!thisBlock.dependentInputShown) {
                Blockly.ComputerCraft.
                    DependentInputBlock.showDependentInput_(thisBlock, true);
              }
            } else {
              if (thisBlock.dependentInputShown) {
                Blockly.ComputerCraft.
                    DependentInputBlock.removeDependentInput_(thisBlock);
              }
            }
          });
      } else {
        // It's another dropdown menu.
        newTuple[1] = new Blockly.FieldDropdown(tuple[1]);
      }
      args.push(newTuple);
    }
  }
  // This will call interpolateMsg.
  Blockly.ComputerCraft.ValueBlock.prototype.init.call(this, args);

  // Determine the position of the dependent input so it can be reinserted
  // in the same place when needed.  Note that inputs may be added (or removed)
  // after it, but it is not permitted to remove earlier inputs.
  for (var i = 0; i < this.inputList.length; i++) {
    if (this.inputList[i].name == this.info.depName) {
      this.depPos = i;
    }
  }
  goog.asserts.assert(
    typeof this.depPos == 'number',
    'Dependent input ' + this.info.depName + ' could not be found.');

  // Check whether the dependent input should be removed.
  if (this.getTitleValue(this.info.ddName) == this.info.ddValue) {
    this.dependentInputShown = true;
  } else {
    Blockly.ComputerCraft.DependentInputBlock.removeDependentInput_(this);
  }
};

// Show the dependent input.  The argument permitChild determines whether
// to examine block.info.addChild and consider creating a child input.
// This is needed to prevent the child from being created twice when
// this is called from domToMutation.
Blockly.ComputerCraft.DependentInputBlock.showDependentInput_ =
    function(block, permitChild) {
      // Create dependent input, and put it into position.
      var depInput = block.appendValueInput(block.info.depName)
          .setCheck(block.info.depType);
      if (block.info.depTitle) {
        depInput.appendTitle(block.info.depTitle);
      }
      block.moveNumberedInputBefore(block.inputList.length - 1, block.depPos);

      // Check if we should create a child block.
      if (permitChild && block.info.addChild) {
        goog.asserts.assert(
          block.info.depType == 'String' || block.info.depType == 'Number',
          'When addChild is true, depType must be String or Number, not ' +
          block.info.depType);
        var childBlock = new Blockly.Block(
          block.workspace,
          block.info.depType == 'String' ? 'text' : 'math_number');
        childBlock.initSvg();
        childBlock.render();
        depInput.connection.connect(childBlock.outputConnection);
        if (block.info.addChild == Blockly.ComputerCraft.InputAddType.FIRST) {
          block.info.addChild = Blockly.ComputerCraft.InputAddType.NEVER;
        }
      }

      block.dependentInputShown = true;
    };

Blockly.ComputerCraft.DependentInputBlock.removeDependentInput_ =
    function(block) {
      block.removeInput(block.info.depName);
      block.dependentInputShown = false;
    };

Blockly.ComputerCraft.DependentInputBlock.prototype.mutationToDom =
    function() {
      var container = document.createElement('mutation');
      container.setAttribute('dependent_input', this.dependentInputShown);
      container.setAttribute('add_child', this.info.addChild);
      return container;
    };

Blockly.ComputerCraft.DependentInputBlock.prototype.domToMutation =
    function(xmlElement) {
      var value = xmlElement.getAttribute('dependent_input') ||
          // Included for backward compatability.
          xmlElement.getAttribute('cable_mode');
      if (value == 'true' && !this.dependentInputShown) {
        Blockly.ComputerCraft.DependentInputBlock.showDependentInput_(
          this, false);
      }
      value = xmlElement.getAttribute('add_child');
      if (value) {
        this.info.addChild = parseInt(value);
      }
    };

Blockly.ComputerCraft.DependentInputBlock.prototype.generateDropdownCode =
    function(field) {
      // If this is a controlling dropdown, we need to check to see
      // whether we should generate code for it.
      if (field.name == this.info.ddName) {
        // Define convenience alias.
        var Type = Blockly.ComputerCraft.ControllingInputCodeGenType;
        if (this.info.codeGenType == Type.NEVER) {
          return null;
        } else if (this.info.codeGenType == Type.ONLY_IF_DEP_HIDDEN) {
          if (field.value_ == this.info.ddValue) {
            return null;
          }
        } else {
          goog.asserts.assert(
            block.info.codeGenType == Type.ALWAYS,
            'Illegal value for info.codeGenType: ', block.info.codeGenType);
        }
      }
      return Blockly.ComputerCraft.ValueBlock.prototype.generateDropdownCode.
          call(this, field);
    };
