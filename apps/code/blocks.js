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

Blockly.ComputerCraft.CAPITAL_LETTER_REGEX_ = /[A-Z]/;

/**
 * Generate a block name, such as 'peripheral_get_names'.  This is done by
 * appending:
 * - prefix
 * - an underscore
 * - either:
 *   - info.blockName, if provided, or
 *   - info.funcName, with every instance of '[A-Z]' replaced with '_[a-z]'.
 *     For example, 'is_present'  would become 'isPresent'.
 * @param {string} prefix A ComputerCraft API prefix, such as 'os'.
 * @param {Object} func An object containing a funcName field and optionally
 *     a blockName
 * @return {string} An underscore-separated string suitable for use as a block
 *     name.
 */
Blockly.ComputerCraft.getBlockName_ = function(prefix, info) {
  var name = info.blockName;
  if (!name) {
    name = '';
    for (var i = 0; i < info.funcName.length; i++) {
      var c = info.funcName[i];
      if (Blockly.ComputerCraft.CAPITAL_LETTER_REGEX_.test(c)) {
        name += '_' + c.toLowerCase();
      } else {
        name += c;
      }
    }
  }
  return prefix + '_' + name;
}

Blockly.ComputerCraft.Block = function(prefix, colour, info) {
  this.prefix = prefix;
  this.colour = colour;
  this.info = info;
  this.blockName = Blockly.ComputerCraft.getBlockName_(prefix, info);
};

Blockly.ComputerCraft.HelpUrlType = {
  PREFIX_NAME: 1,  // Used by Block.
  PREFIX_DIR: 2    // Used by ExpStmtBlock.
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


// This also uses info.directions.
Blockly.ComputerCraft.ExpStmtBlock = function(prefix, colour, info) {
  Blockly.ComputerCraft.Block.call(this, prefix, colour, info);
  info.output = 'Boolean';
  info.multipleOutputs = 2;
  // Provide some shortcuts.
/*
  this.adjustCode = function(code) {
    return Blockly.ComputerCraft.ExpStmtBlock.prototype.adjustCode.call(this, code);
  }
*/
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
/*
  // Create Lua generator.
  if (!this.info.suppressLua) {
    Blockly.Lua[this.blockName] = function(block) {
      var code = block.prefix + '.';
      if (block.info.directions) {
        code += block.getTitleValue('DIR') + '(';
      } else {
        code += block.funcName + '(';
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
*/
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

Blockly.ComputerCraft.StmtConns = {
  NONE: 0,
  PREVIOUS: 1,
  NEXT: 2,
  BOTH: 3  // Provided for convenience.
};


// ValueBlock is a block whose only inputs are value inputs (no dropdown
// menus, etc.).  It should be constructed with buildValueBlock(), below,
// which describes the parameters.

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
 * Create a block that has only value inputs (no dropdown menus, etc.).
 *
 * This creates Blockly.Blocks[NAME] and Blockly.Lua[NAME], where
 * name is blockName, or inferred from funcName.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} info An object with the following fields:
 *     - {string} funcName The name of the ComputerCraft function to be called,
 *         not including the prefix.
 *     - {?string} blockName The name of the block to be created, without the
 *         prefix.  If not provided, this will be inferred from funcName.
 *     - {?number} stmtConns The types of statement connections, if any.
 *         This should be the disjunction of Blockly.ComputerCraft.StmtConns
 *         values and may be omitted if there are no statement connections.
 *     - {?string} output The type of the output, if any.  Legal values are
 *         {'Boolean', 'Number', 'String', 'Table'}.  This should be omitted
 *         if the block does not have an output.
 *     - {?number} multipleOutputs The number of outputs, if greater than 1.
 *     - {string} text The block text, with %1 for the first value input,
 *         %2 for the second, etc.
 *     - {?Array.<Array.<string>>} args An array of two-element arrays, where
 *         the first element of each sub-array is an input name, and the
 *         second element is its type, from the set above.  This may be
 *         omitted or the empty list if there are no inputs.
 *     - {?string} tooltip The text for the tooltip.
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

// BlockWithSide is a block that has a "side" input (one of 'front', 'back',
// 'left', 'right', 'top', 'bottom', or an arbitrary string identifying a
// cable).  It may also have other inputs.  It should be built with
// buildSideBlock(), below, which describes the parameters.

Blockly.ComputerCraft.BlockWithSide = function(prefix, colour, info) {
  Blockly.ComputerCraft.Block.call(this, prefix, colour, info);
  this.prefix = prefix;
}

Blockly.ComputerCraft.BlockWithSide.prototype.init = function() {
  Blockly.ComputerCraft.Block.prototype.init.call(this);
  this.appendDummyInput()
      .appendTitle(this.info.text);
  this.addSideInput();
};

/**
 * Create a block that has a side input.
 *
 * This creates Blockly.Blocks[NAME] and Blockly.Lua[NAME], where
 * NAME is info.blockName or inferred from info.funcName.  FIX
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as 'os'.
 * @param {number} colour The block's colour.
 * @param {!Object} info An object with the following fields:
 *     - {string} funcName The name of the ComputerCraft function to be called,
 *         without the prefix.
 *     - {?string} blockName The name of the block to be created, without the
 *         prefix.  If not provided, this will be inferred from funcName.
 *     - {string} text The block text.
 *     - {?number} stmtConns The types of statement connections, if any.
 *         This should be the disjunction of Blockly.ComputerCraft.StmtConns
 *         values and may be omitted if there are no statement connections.
 *     - {?string} output The type of the output, if any.  Legal values are
 *         {'Boolean', 'Number', 'String', 'Table'}.  This should be omitted
 *         if the block does not have an output.
 *     - {?number} multipleOutputs The number of outputs, if greater than 1.
 *     - {?string} tooltip The text for the tooltip.
 */
Blockly.ComputerCraft.buildBlockWithSide = function(prefix, colour, info) {
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
