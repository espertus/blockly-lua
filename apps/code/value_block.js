/**
 * Blockly Lua: ComputerCraft ValueBlock class
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
 * @fileoverview Class for ComputerCraft blocks that have only simple value
 *     inputs and dropdown menus.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.provide('ComputerCraft.ValueBlock');

goog.require('ComputerCraft.Block');

/**
 * Class for ComputerCraft blocks whose inputs, if any, are all value inputs.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     In addition to the fields used for the parent class
 *     Blockly.ComputerCraft.Block, there are:
 *     <ul>
 *     <li>text {!string} Block text, suitable for passing to
 *         Blockly.Block.prototype.interpolateMsg.apply(this, interpArgs);
 *     <li>args {?Array.<Array.<string>>} A series of tuples describing
 *         the value inputs.  The first element of each tuple is its name,
 *         the second its type (which may be null, a string, or a
 *         FieldDropdown).  If there are no arguments, this may be omitted.
 *     <li>expStmt {?boolean} Whether the block can switch between being an
 *         expression and statement.  Such blocks always start in expression
 *         mode.
 *     <li>ddFuncName {?string} The name of the dropdown menu whose value gives
 *         the function name.  Set to false to use funcName instead and to use
 *         the dropdown value as a parameter in code generation.
 *     <li>quoteDropdownValues {?boolean} Indicates whether dropdown values
 *         should be quoted when used as parameters.  This defaults to true.
 *     </ul>
 * @return {Blockly.ComputerCraft.ValueBlock} The new block.
 */
Blockly.ComputerCraft.ValueBlock = function(prefix, colour, info) {
  if (!info.args) {
    info.args = [];
  }
  if (info.text) {
    info.text = info.text.trim();
  }
  if (info.expStmt) {
    goog.asserts.assert(info.output,
      'If info.expStmt is true, info.output must be set.');
  }
  Blockly.ComputerCraft.ValueBlock.superClass_.constructor.call(
    this, prefix, colour, info);
};
goog.inherits(Blockly.ComputerCraft.ValueBlock, Blockly.ComputerCraft.Block);

/**
 * Build up a help URL based on the current value of a dropdown menu.
 * @param {!object} block A block containing an dropdown menu.
 * @param {!title} title The name of the dropdown menu whose value
 *   should be used in construct the URL.
 * @return {string} A help URL
 */
Blockly.ComputerCraft.buildDynamicHelpUrl_ = function(block, title) {
  return Blockly.ComputerCraft.BASE_HELP_URL +
      block.prefix.charAt(0).toUpperCase() + block.prefix.slice(1) + '.' +
      block.getTitleValue(block.info.ddFuncName);
};

Blockly.ComputerCraft.ValueBlock.prototype.init = function(opt_args) {
  // Set up the help URL if it is variable.
  if (this.info.helpUrlType == Blockly.ComputerCraft.HelpUrlType.PREFIX_DD) {
    var thisBlock = this;
    this.setHelpUrl(function() {
      return Blockly.ComputerCraft.buildDynamicHelpUrl_(
        thisBlock, thisBlock.info.ddFuncName);
    });
  }

  Blockly.ComputerCraft.Block.prototype.init.call(this);

  // Build up arguments to the format expected by interpolateMsg.
  var interpArgs = [];
  interpArgs.push(this.info.text);
  var args = opt_args || this.info.args;
  if (args) {
    for (var j = 0; j < args.length; j++) {
      var arg = [];
      arg.push(args[j][0]);  // name
      // The next argument is either a type (expressed as a string) for a
      // value input, or a Blockly.FieldDropdown.
      if (args[j][1] instanceof Blockly.FieldDropdown) {
        var dd = args[j][1].clone();
        dd.prefixTitle = args[j][1].prefixTitle;
        dd.suffixTitle = args[j][1].suffixTitle;
        arg.push(dd);
      } else {
        arg.push(args[j][1]);
      }
      arg.push(Blockly.ALIGN_RIGHT);
      interpArgs.push(arg);
    }
  }
  interpArgs.push(Blockly.ALIGN_RIGHT);
  Blockly.Block.prototype.interpolateMsg.apply(this, interpArgs);
};

Blockly.ComputerCraft.ValueBlock.prototype.generateDropdownCode = function(field) {
  if (field.name == this.info.ddFuncName) {
    // Don't generate code if the this dropdown determined the name
    // of the function call.
    return null;
  }
  // If we made it here, we should generate code.
  if (this.info.quoteDropdownValues ||
      typeof this.info.quoteDropdownValues == 'undefined') {
    return "'" + field.value_ + "'";
  } else {
    return field.value;
  }
};

/**
 * Create a block whose inputs, if any, are all value inputs.
 *
 * This also creates a Lua code generator.  It outputs code for the
 * inputs in the order in which they appear in info.args, not their
 * order in blocks.inputList.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} info Information about the block being defined.
 *     In addition to the fields used in the constructor
 *     Blockly.ComputerCraft.ValueBlock, this optionally includes:
 *     - suppressLua {?boolean} Whether to suppress definition of
 *       Blockly.Lua[info.blockName].
 * @return {Blockly.ComputerCraft.ValueBlock} The new block.
 */
Blockly.ComputerCraft.buildValueBlock = function(prefix, colour, info) {
  if (!info.helpUrlType) {
    info.helpUrlType = Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME;
  }
  var newBlock = new Blockly.ComputerCraft.ValueBlock(prefix, colour, info);
  Blockly.Blocks[newBlock.blockName] = newBlock;
  if (!info.suppressLua) {
    Blockly.Lua[newBlock.blockName] =
        Blockly.ComputerCraft.Block.prototype.generateLua;
  }
  return newBlock;
};

/**
 * Change a block between expression and statement mode.
 * @param {!boolean} shouldBeStatement True if the block should become a
 *     statement, false for an expression.
 * @throws {goog.asserts.AssertionError} if the block was not defined as
 *     convertible between statement and expression (through info.expStmt).
 */
Blockly.ComputerCraft.ValueBlock.prototype.changeModes =
    function(shouldBeStatement) {
  goog.asserts.assert(this.info.expStmt,
    'changeModes() should only be called if this.info.expStmt.');
  this.unplug(true, true);
  if (shouldBeStatement) {
    this.setOutput(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.isStatement = true;
  } else {
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setOutput(true);
    this.isStatement = false;
  }
};

Blockly.ComputerCraft.ValueBlock.prototype.customContextMenu =
    function(options) {
      if (this.info.expStmt) {
        var option = {enabled: true};
        option.text = this.isStatement ? 'Add Output' : 'Remove Output';
        var thisBlock = this;
        option.callback = function() {
          thisBlock.changeModes(!thisBlock.isStatement);
        };
        options.push(option);
      }
};

Blockly.ComputerCraft.ValueBlock.prototype.mutationToDom = function() {
  if (this.info.expStmt) {
    // Save whether it is a statement.
    var container = document.createElement('mutation');
    container.setAttribute('is_statement', this['isStatement'] || false);
    return container;
  }
};

Blockly.ComputerCraft.ValueBlock.prototype.domToMutation
    = function(xmlElement) {
      if (this.info.expStmt) {
        this.changeModes(xmlElement.getAttribute('is_statement') == 'true');
      }
};

Blockly.ComputerCraft.ValueBlock.prototype.getFuncName = function() {
  return this.prefix + '.' +
      (this.info.ddFuncName ? this.getTitleValue(this.info.ddFuncName)
       : this.info.funcName);
};

Blockly.ComputerCraft.ValueBlock.prototype.getOrderedParameterNames =
    function() {
      return this.info.args.map(
        function(pair) {
          return pair[0];
        });
    };

// Used in blocks-rednet.js and blocks-redstone.js.
Blockly.ComputerCraft.ValueBlock.SIDES = [['left', 'left'],
                                          ['right', 'right'],
                                          ['front', 'front'],
                                          ['back', 'back'],
                                          ['top', 'top'],
                                          ['bottom', 'bottom']];
