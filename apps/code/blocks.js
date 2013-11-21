/**
 * Blockly Lua: ComputerCraft
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
 * @fileoverview Blocks for ComputerCraft turtles.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft = {};

Blockly.ComputerCraft.BASE_HELP_URL = 'http://computercraft.info/wiki/';

/**
 * Whether the described block should have previous and next statement
 * connections.
 */
Blockly.ComputerCraft.StmtConns = {
  NONE: 0,
  PREVIOUS: 1,
  NEXT: 2,
  BOTH: 3  // Provided for convenience.
};

/**
 * Ways of computing a help URL as a function of other pieces of information
 * about a block.  In all cases, the URL begins with
 * Blockly.ComptuerCraft.BASE_HELP_URL.
 */
Blockly.ComputerCraft.HelpUrlType = {
  // Concatenate the prefix and funcName.
  PREFIX_NAME: 1,  // Used by Block.
  // Concatenate the prefix and chosen direction value.
  PREFIX_DIR: 2    // Used by ExpStmtBlock.
};

// This is only used in Blockly.ComputerCraft.getBlockName_ but is declared
// here to avoid recompilation.
Blockly.ComputerCraft.CAPITAL_LETTER_REGEX_ = /[A-Z]/;

/**
 * Generate a block name, such as 'peripheral_get_names'.  This is done by
 * appending:
 * - prefix
 * - an underscore
 * - either:
 *   - info.blockName, if provided, or
 *   - info.funcName, with every instance of '[A-Z]+' replaced with '_[a-z]+'.
 *     For example, 'isPresent' would become 'is_present' and
 *     'getID' would become 'get_id'.
 * @param {string} prefix A ComputerCraft API prefix, such as 'os'.
 * @param {Object} func An object containing a funcName field and optionally
 *     a blockName
 * @return {string} An underscore-separated string suitable for use as a block
 *     name.
 */
Blockly.ComputerCraft.getBlockName_ = function(prefix, info) {
  var name = info.blockName;
  var inCapital = false;
  if (!name) {
    name = '';
    for (var i = 0; i < info.funcName.length; i++) {
      var c = info.funcName[i];
      if (Blockly.ComputerCraft.CAPITAL_LETTER_REGEX_.test(c)) {
        // Only place one underscore for multiple adjacent capital letters.
        if (!inCapital) {
          inCapital = true;
          name += '_';
        }
      } else {
        inCapital = false;
      }
      name += c.toLowerCase();
    }
  }
  return prefix + '_' + name;
}

/**
 * Base class for ComputerCraft blocks.
 *
 * This is used directly in creating blocks, and it is extended by
 * Blockly.ComputerCraft.ExpStmtBlock and Blockly.ComputerCraft.ValueBlock.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     The following fields are used:
 *     <ul>
 *     <li>blockName {?string} The Blockly name of the block (once the prefix
 *         is added, such as 'turtle_turn'.  If not provided, this is inferred
 *         from funcName via Blockly.ComputerCraft.getBlockName_().
 *     <li>funcName {?string} The name of the Lua function generated by this
 *         block.  This must be provided if blockName is not.
 *     <li>stmtConns {?Blockly.ComputerCraft.StmtConns}
 *         Whether there are previous and next statements.
 *         If absent, no statement connections will be added.
 *     <li>output {?string|Array.<string>} Type(s) of the first output.
 *         If absent, there are assumed to be no outputs.
 *     <li>multipleOutputs {?number} The number of outputs, if greater than 1.
 *     <li>tooltip {?string} Tooltip text.
 *     <li>helpUrl {?Blockly.ComputerCraft.HelpUrlType} How to create the
 *         help URL, as a function of other fields.
 *     </ul>
 */
Blockly.ComputerCraft.Block = function(prefix, colour, info) {
  this.prefix = prefix;
  this.colour = colour;
  this.info = info;
  this.blockName = Blockly.ComputerCraft.getBlockName_(prefix, info);
};

Blockly.ComputerCraft.Block.prototype.init = function() {
  this.setColour(this.colour);
  this.setInputsInline(true);
  if (this.info.helpUrlType ==
      Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME) {
      this.helpUrl =
        Blockly.ComputerCraft.BASE_HELP_URL +
            this.prefix.charAt(0).toUpperCase() +
            this.prefix.slice(1) + '.' + this.info.funcName;
  }
  if (this.info.tooltip) {
    this.setTooltip(this.info.tooltip);
  }
  if (this.info.stmtConns) {
    this.setPreviousStatement(
      (this.info.stmtConns & Blockly.ComputerCraft.StmtConns.PREVIOUS) != 0);
    this.setNextStatement(
      (this.info.stmtConns & Blockly.ComputerCraft.StmtConns.NEXT) != 0);
  }
  if (this.info.output) {
    this.setOutput(true, this.info.output);
  }
  if (this.info.multipleOutputs) {
    this.multipleOutputs = this.info.multipleOutputs;
    this.setOutput(true);  // We don't specify types for multiple outputs.
  }
  // Subclass must set up inputs, including block title.
};


/**
 * Class for ComputerCraft blocks that can switch between being expressions
 * and statements.  These are all assumed to have a Boolean first output
 * and a second (String) output.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     In addition to the fields used for the parent class
 *     Blockly.ComputerCraft.Block:
 *     <ul>
 *     <li>directions {?Array.<Array.<string>>} An array of tuples used to
 *         create a dropdown menu.  The first element of each tuple is the
 *         displayed text; the second element is the internal name, usually
 *         the name of a Lua function.
 *     </ul>
 * @return {Blockly.ComputerCraft.ExpStmtBlock} The new block.
 */
Blockly.ComputerCraft.ExpStmtBlock = function(prefix, colour, info) {
  Blockly.ComputerCraft.Block.call(this, prefix, colour, info);
  info.output = 'Boolean';
  info.multipleOutputs = 2;
};

/**
 * Static factory method for Blockly.ComputerCraft.ExpStmtBlock.  This
 * creates and adds to the namespace the block definition and, optionally,
 * a Lua code generator.
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     In addition to the fields used by the Blockly.ComputerCraft.ExpStmtBlock
 *     constructor, this has:
 *     <ul>
 *     <li>suppressLua {boolean} If true, no Lua code generator is created.
 *     </ul>
 */
Blockly.ComputerCraft.buildExpStmtBlock = function(prefix, colour, info) {
  var newBlock = new Blockly.ComputerCraft.ExpStmtBlock(prefix, colour, info);
  Blockly.Blocks[newBlock.blockName] = newBlock;
  if (!newBlock.suppressLua) {
    Blockly.Lua[newBlock.blockName] = function(block) {
      var code = block.prefix + '.';
      if (block.info.directions) {
        code += block.getTitleValue('DIR') + '(';
      } else {
        code += block.info.funcName + '(';
      }
      var args = block.inputList.filter(function(i) {
        return i.type == Blockly.INPUT_VALUE;}).
          map(function(i) {
            return Blockly.Lua.valueToCode(
              block, i.name, Blockly.Lua.ORDER_NONE);
          });
      code += args.join(', ');
      code += ')';
      return Blockly.ComputerCraft.ExpStmtBlock.prototype.adjustCode.call(
        block, code);
    }
  }
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.init = function() {
  Blockly.ComputerCraft.Block.prototype.init.call(this);
  if (this.info.directions) {
    this.appendDummyInput('DIRECTIONS')
        .appendTitle(new Blockly.FieldDropdown(this.info.directions), 'DIR');
  }
  if (this.info.helpUrlType ==
      Blockly.ComputerCraft.HelpUrlType.PREFIX_DIR) {
    var thisBlock = this;
    this.setHelpUrl(function() {
      return Blockly.ComputerCraft.BASE_HELP_URL +
            thisBlock.prefix.charAt(0).toUpperCase() +
            thisBlock.prefix.slice(1) + '.' + thisBlock.getTitleValue('DIR');
    });
  }
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.changeModes =
    function(shouldBeStatement) {
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

Blockly.ComputerCraft.ExpStmtBlock.prototype.customContextMenu =
    function(options) {
  var option = {enabled: true};
  option.text = this.isStatement ? 'Add Output' : 'Remove Output';
  var thisBlock = this;
  option.callback = function() {
    thisBlock.changeModes(!thisBlock.isStatement);
  };
  options.push(option);
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.mutationToDom = function() {
  // Save whether it is a statement.
  var container = document.createElement('mutation');
  container.setAttribute('is_statement', this['isStatement'] || false);
  return container;
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.domToMutation
    = function(xmlElement) {
  this.changeModes(xmlElement.getAttribute('is_statement') == 'true');
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.adjustCode = function(code) {
  if (this.isStatement) {
    return code + '\n';
  } else {
    return [code, Blockly.Lua.ORDER_HIGH];
  }
};

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
 *         the value inputs.  The first element of each tuple it its name,
 *         the second its type (which may be null).
 *     </ul>
 * @return {Blockly.ComputerCraft.ExpStmtBlock} The new block.
 */
Blockly.ComputerCraft.ValueBlock = function(prefix, colour, info) {
  Blockly.ComputerCraft.Block.call(this, prefix, colour, info);
}

Blockly.ComputerCraft.ValueBlock.prototype.init = function() {
  Blockly.ComputerCraft.Block.prototype.init.call(this);
  // Build up arguments to the format expected by interpolateMsg.
  var interpArgs = []
  interpArgs.push(this.info.text);
  if (this.info.args) {
    for (var j = 0; j < this.info.args.length; j++) {
      var arg = [];
      arg.push(this.info.args[j][0]);  // name
      arg.push(this.info.args[j][1]);  // type
      arg.push(Blockly.ALIGN_RIGHT);
      interpArgs.push(arg);
    }
  }
  interpArgs.push(Blockly.ALIGN_RIGHT);
  Blockly.Block.prototype.interpolateMsg.apply(this, interpArgs);
}

/**
 * Create a block whose inputs, if any, are all value inputs.  This
 * also creates a Lua code generator.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} info Information about the block being defined.
 *     This adds no fields to the ones used by the constructor
 *     Blockly.ComputerCraft.ValueBlock.
 */
Blockly.ComputerCraft.buildValueBlock = function(prefix, colour, info) {
  info.helpUrlType = Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME;
  var newBlock = new Blockly.ComputerCraft.ValueBlock(prefix, colour, info);
  Blockly.Blocks[newBlock.blockName] = newBlock;
  Blockly.Lua[newBlock.blockName] = function(block) {
    return Blockly.ComputerCraft.ValueBlock.generateLua(
      block,
      info.args ? info.args.map(function(pair) {return pair[0];}) : []);
  };
};

Blockly.ComputerCraft.ValueBlock.generateLua = function(block, argNames) {
  var args = argNames.map(function(name) {
    return Blockly.Lua.valueToCode(block, name, Blockly.Lua.ORDER_NONE);
  });
  var code = block.prefix + '.' + block.info.funcName +
      '(' + args.join(', ') + ')';
  if (block.info.output) {
    return [code, Blockly.Lua.ORDER_HIGH];
  } else {
    return code + '\n';
  }
};

/**
 * Class for ComputerCraft blocks that have a 'side' input (one of 'front',
 * 'back', 'left', 'right', 'top', 'bottom', or an arbitrary string identifying
 * a cable).  The block may also have other inputs.
 *
 * A question mark is added to the end of the block name if the output (as
 * specified in the 'info' parameter) is Boolean.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     In addition to the fields used for the parent class
 *     Blockly.ComputerCraft.Block:
 *     <ul>
 *     <li>text {!string} The block title.
 *     </ul>
 * @return {Blockly.ComputerCraft.BlockWithSide} The new block.
 */
Blockly.ComputerCraft.BlockWithSide = function(prefix, colour, info) {
  Blockly.ComputerCraft.Block.call(this, prefix, colour, info);
  this.prefix = prefix;
}

Blockly.ComputerCraft.BlockWithSide.prototype.init = function() {
  Blockly.ComputerCraft.Block.prototype.init.call(this);
  this.appendDummyInput()
      .appendTitle(this.info.text);
  this.addSideInput();
  if (this.info.output == 'Boolean') {
    this.appendDummyInput()
        .appendTitle('?');
  };
};

/**
 * Create a block that has a side input.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     The fields are the same as for the constructor
 *     Blockly.ComputerCraft.BlockWithSide.
 */
Blockly.ComputerCraft.buildBlockWithSide = function(prefix, colour, info) {
  if (!info.helpUrlType) {
    info.helpUrlType = Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME;
  }
  // If no output or statement connections are specified,
  // place a previous and next statement connector.
  if (!info.output && !info.stmtConns && !(info.stmtConns == 0)) {
    info.stmtConns =  Blockly.ComputerCraft.StmtConns.BOTH;
  }
  var newBlock = new Blockly.ComputerCraft.BlockWithSide(prefix, colour, info);
  Blockly.Blocks[newBlock.blockName] = newBlock;
  Blockly.Lua[newBlock.blockName] =
      Blockly.ComputerCraft.BlockWithSide.prototype.generateLua;
};

Blockly.ComputerCraft.BlockWithSide.SIDES_ =
    [['in front', 'front'],
     ['in back', 'back'],
     ['to the left', 'left'],
     ['to the right', 'right'],
     ['above', 'top'],
     ['below', 'bottom'],
     ['through cable...', 'cable']];

Blockly.ComputerCraft.BlockWithSide.prototype.addSideInput = function() {
  var thisBlock = this;
  this.appendDummyInput('SIDE')
      .appendTitle(
        new Blockly.FieldDropdown(
          Blockly.ComputerCraft.BlockWithSide.SIDES_,
          function(value) {
            if (value == 'cable') {
              if (!thisBlock.cableMode) {
                thisBlock.enterCableMode();
              }
            } else {
              if (thisBlock.cableMode) {
                thisBlock.leaveCableMode();
              }
            }
          }),
        'SIDES');
  this.cableMode = false;
};

Blockly.ComputerCraft.BlockWithSide.prototype.enterCableMode = function() {
  // Create child text block.
  // Perhaps this should only be done once per block?
  var textBlock = new Blockly.Block(this.workspace, 'text');
  textBlock.initSvg();
  textBlock.render();
  this.appendValueInput('CABLE')
      .setCheck('String')
      .connection.connect(textBlock.outputConnection);
  this.cableMode = true;
};

Blockly.ComputerCraft.BlockWithSide.prototype.leaveCableMode = function() {
    this.removeInput('CABLE', true);
    this.cableMode = false;
  };

Blockly.ComputerCraft.BlockWithSide.prototype.mutationToDom = function() {
  var container = document.createElement('mutation');
  container.setAttribute('cable_mode', this.cableMode);
  return container;
};

Blockly.ComputerCraft.BlockWithSide.prototype.domToMutation =
    function(xmlElement) {
  this.cableMode = xmlElement.getAttribute('cable_mode') == 'true';
  if (this.cableMode) {
    this.appendValueInput('CABLE')
        .setCheck('String');
  }
};

Blockly.ComputerCraft.BlockWithSide.prototype.generateLua =
    function(block) {
  var side = block.cableMode ?
      (Blockly.Lua.valueToCode(block, 'CABLE', Blockly.Lua.ORDER_NONE) || '')
      :  block.getTitleValue('SIDES');
  var code = block.prefix + '.' + block.info.funcName + '(\'' + side + '\')';
  return [code, Blockly.Lua.ORDER_HIGH];
};
