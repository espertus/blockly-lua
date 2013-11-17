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

BlocklyLua.buildValueBlock = function(
  blockName, colour, inline, helpUrl, tooltip, statements, output,
  interpArgs, funcName) {
  Blockly.Blocks[blockName] = {
    init: function() {
      this.setColour(colour);
      this.setInputsInline(inline);
      this.setHelpUrl(helpUrl);
      this.setTooltip(tooltip);
      this.setPreviousStatement(statements & BlocklyLua.StmtConns.PREVIOUS);
      this.setNextStatement(statements & BlocklyLua.StmtConns.NEXT);
      if (output) {
        this.setOutput(true, output);
      }
      this.setInputsInline(inline);
      Blockly.Block.prototype.interpolateMsg.apply(this, interpArgs);
    }
  };
  Blockly.Lua[blockName] = function(block) {
    return BlocklyLua.generateValueCode(block, funcName, interpArgs);
  };
};

BlocklyLua.generateValueCode = function(block, funcName, interpArgs) {
  var inputNames = [];
  for (var i = 1; i < interpArgs.length - 1; i++) {
    inputNames.push(interpArgs[i][0]);
  }
  var args = inputNames.map(function(name) {
    return Blockly.Lua.valueToCode(block, name, Blockly.Lua.ORDER_NONE);
  });
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Lua.ORDER_HIGH];
};
