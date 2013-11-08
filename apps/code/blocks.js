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

var BlocklyLua = {}

BlocklyLua.BASE_HELP_URL = 'http://computercraft.info/wiki/';

/**
 These functions help make a block so that it can convert between
 expression and statement form (in case the programmer wants to ignore the
 return value).  The block will begin in expression mode, unless the following
 line is included in the block's init() method:

     this.isStatement = true;

 The following definitions must appear in the block definition:

     // Enable block to change between statement and expression.
     changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
     customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
     mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
     domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']

 The code generator should first generate the code for an expression
 and then call generatedCode(block, code), as shown:

     return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);

 Note: The conventional leading asterisks are omitted for ease of
 copying the above code.
 */

BlocklyLua.HELPER_FUNCTIONS = {
  changeModes: function(thisBlock, shouldBeStatement) {
    thisBlock.unplug(true, true);
    if (shouldBeStatement) {
      thisBlock.setOutput(false);
      thisBlock.setPreviousStatement(true);
      thisBlock.setNextStatement(true);
      thisBlock.isStatement = true;
    } else {
      thisBlock.setPreviousStatement(false);
      thisBlock.setNextStatement(false);
      thisBlock.setOutput(true);
      thisBlock.isStatement = false;
    }
  },
  customContextMenu: function(options) {
    var option = {enabled: true};
    option.text = this.isStatement ? 'Add Output' : 'Remove Output';
    var thisBlock = this;
    option.callback = function() {
      thisBlock.changeModes(thisBlock, !thisBlock.isStatement);
    };
    options.push(option);
  },
  mutationToDom: function() {
    // Save whether it is a statement.
    var container = document.createElement('mutation');
    container.setAttribute('is_statement', this['isStatement'] || false);
    return container;
  },
  domToMutation: function(xmlElement) {
    this.changeModes(this, xmlElement.getAttribute('is_statement') == 'true');
  },
  generatedCode: function(block, code) {
    if (block.isStatement) {
      return code + '\n';
    } else {
      return [code, Blockly.Lua.ORDER_HIGH];
    }
  }
};
