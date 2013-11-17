/**
 * Blockly Apps: Blocklycraft
 *
 * Copyright 2012 Google Inc.
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

var BlocklyLua = {};

BlocklyLua.BASE_HELP_URL = 'http://computercraft.info/wiki/';

BlocklyLua.ExpStmtBlock = function() {};

BlocklyLua.ExpStmtBlock.prototype.changeModes = function(shouldBeStatement) {
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

BlocklyLua.ExpStmtBlock.prototype.customContextMenu = function(options) {
  var option = {enabled: true};
  option.text = this.isStatement ? 'Add Output' : 'Remove Output';
  var thisBlock = this;
  option.callback = function() {
    thisBlock.changeModes(!thisBlock.isStatement);
  };
  options.push(option);
};

BlocklyLua.ExpStmtBlock.prototype.mutationToDom = function() {
  // Save whether it is a statement.
  var container = document.createElement('mutation');
  container.setAttribute('is_statement', this['isStatement'] || false);
  return container;
};

BlocklyLua.ExpStmtBlock.prototype.domToMutation = function(xmlElement) {
  this.changeModes(xmlElement.getAttribute('is_statement') == 'true');
};

BlocklyLua.ExpStmtBlock.prototype.adjustCode = function(code) {
  if (this.isStatement) {
    return code + '\n';
  } else {
    return [code, Blockly.Lua.ORDER_HIGH];
  }
};

BlocklyLua.StmtConns = {
  NONE: 0,
  PREVIOUS: 1,
  NEXT: 2
};

/**
 * Create a block, including Lua code generation.  The block's inputs, if any,
 * must all be value inputs (no dropdown menus, etc.).
 *
 * This creates Blockly.Blocks[NAME] and Blockly.Lua[NAME], where
 * NAME is func.prefix + '_' + func.name, as described below.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a ComputerCraft
 *     API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} func An object with the following fields:
 *     - {string} name The name of the ComputerCraft function to be called,
 *         not including the prefix.
 *     - {number} stmtConns The types of statement connections, if any.
 *         This should be the disjunction of BlocklyLua.StmtConns values
 *         and may be omitted if there are no statement connections.
 *     - {string} output The type of the output, if any.  Legal values are
 *         {'Boolean', 'Number', 'String', 'Table'}.  This should be omitted
 *         if the block does not have an output.
 *     - {string} text The block text, with %1 for the first value input,
 *         %2 for the second, etc.
 *     - {Array.<Array.<string>>} args An array of two-element arrays, where
 *         the first element of each sub-array is an input name, and the second
 *         element is its type, from the set above.
 *     - {string} tooltip The text for the tooltip.
 */
BlocklyLua.buildValueBlock = function(prefix, colour, func) {
  var blockName = prefix + '_' + func.name;
  Blockly.Blocks[blockName] = {
    init: function() {
      this.setColour(colour);
      this.setInputsInline(true);
      this.setHelpUrl(
        BlocklyLua.BASE_HELP_URL_ + prefix.charAt(0).toUpperCase() +
            prefix.slice(1) + '.' + func.name);
      this.setTooltip(func.tooltip);
      if (func.stmtConns) {
        this.setPreviousStatement(
          func.stmtConns & BlocklyLua.StmtConns.PREVIOUS);
        this.setPreviousStatement(
          func.stmtConns & BlocklyLua.StmtConns.NEXT);
      }
      if (func.output) {
        this.setOutput(true, func.output);
      }
      // Build up arguments to the format expected by interpolateMsg.
      var interpArgs = []
      interpArgs.push(func.text);
      for (var j = 0; j < func.args.length; j++) {
        var arg = [];
        arg.push(func.args[j][0]);  // name
        arg.push(func.args[j][1]);  // type
        arg.push(Blockly.ALIGN_RIGHT);
        interpArgs.push(arg);
      }
      interpArgs.push(Blockly.ALIGN_RIGHT);
      Blockly.Block.prototype.interpolateMsg.apply(this, interpArgs);
    }
  };
  Blockly.Lua[blockName] = function(block) {
    return BlocklyLua.generateValueCode(
      block,
      prefix + '.' + func.name,
      func.args.map(function(pair) {return pair[0];}));
  };
};

BlocklyLua.generateValueCode = function(block, funcName, argNames) {
  var args = argNames.map(function(name) {
    return Blockly.Lua.valueToCode(block, name, Blockly.Lua.ORDER_NONE);
  });
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Lua.ORDER_HIGH];
};
