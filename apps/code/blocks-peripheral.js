/**
 * Blockly Apps: Blockly Lua
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
 * @fileoverview Blocks for ComputerCraft peripherals.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

BlocklyLua.BASE_PERIPHERAL_HELP_URL_ = BlocklyLua.BASE_HELP_URL + 'Peripheral.';
BlocklyLua.PERIPHERAL_BLOCK_COLOUR_ = 65;

function BlockWithSide(blockName, title, outputType, tooltip, funcName) {
  this.blockName = blockName;
  this.title = title;
  this.outputType = outputType;
  this.tooltip = tooltip;
  this.funcName = funcName;
};

BlocklyLua.SIDES_ = [['in front', 'front'],
                     ['in back', 'back'],
                     ['to the left', 'left'],
                     ['to the right', 'right'],
                     ['above', 'top'],
                     ['below', 'bottom'],
                     ['through cable...', 'cable']];

BlockWithSide.prototype.addSideInput = function() {
  var thisBlock = this;
  this.appendDummyInput('SIDE')
      .appendTitle(
        new Blockly.FieldDropdown(
          BlocklyLua.SIDES_,
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

BlockWithSide.prototype.init = function() {
  this.setColour(BlocklyLua.PERIPHERAL_BLOCK_COLOUR_);
  var thisBlock = this;
  this.appendDummyInput()
      .appendTitle(this.title);
  this.addSideInput();
  this.setOutput(true, this.outputType);
  this.setInputsInline(true);
  this.setTooltip(this.tooltip);
  this.setHelpUrl(BlocklyLua.BASE_PERIPHERAL_HELP_URL_ + this.funcName);
  Blockly.Lua[this.blockName] = BlockWithSide.prototype.generateLua;

};

BlockWithSide.prototype.enterCableMode = function() {
  // Create child text block.  Perhaps this should only be done once per block?
  var textBlock = new Blockly.Block(this.workspace, 'text');
  textBlock.initSvg();
  textBlock.render();
  this.appendValueInput('CABLE')
      .setCheck('String')
      .connection.connect(textBlock.outputConnection);
  this.cableMode = true;
};

BlockWithSide.prototype.leaveCableMode = function() {
    this.removeInput('CABLE', true);
    this.cableMode = false;
  };

BlockWithSide.prototype.mutationToDom = function() {
  var container = document.createElement('mutation');
  container.setAttribute('cable_mode', this.cableMode);
  return container;
};

BlockWithSide.prototype.domToMutation = function(xmlElement) {
  this.cableMode = xmlElement.getAttribute('cable_mode') == 'true';
  if (this.cableMode) {
    this.appendValueInput('CABLE')
        .setCheck('String');
  }
};

BlockWithSide.prototype.generateLua = function(block) {
  var side = block.cableMode ?
      (Blockly.Lua.valueToCode(block, 'CABLE', Blockly.Lua.ORDER_NONE) || '')
      :  block.getTitleValue('SIDES');
  var code = 'peripheral.' + block.funcName + '(\'' + side + '\')';
  return [code, Blockly.Lua.ORDER_HIGH];
};

Blockly.Blocks['peripheral_is_present'] = new BlockWithSide(
  'peripheral_is_present',
  'is peripheral present',
  'Boolean',
  'Return true if a peripheral is connected on the specified side.',
  'isPresent');

Blockly.Blocks['peripheral_get_type'] = new BlockWithSide(
  'peripheral_get_type',
  'get type of peripheral',
  'String',
  'Return the type of the connected peripheral or nil if none present',
  'getType');

Blockly.Blocks['peripheral_get_methods'] = new BlockWithSide(
  'peripheral_get_methods',
  'get method names of peripheral',
  'List',
  'Return a list of the names of the connected peripheral\'s methods,\n' +
      'or nil if no peripheral is connected.',
  'getMethods');

Blockly.Blocks['peripheral_wrap'] = new BlockWithSide(
  'peripheral_wrap',
  'wrap peripheral',
  'List',
  'Return the connected peripheral\'s methods so they can be called,\n' +
      'or nil if no peripheral is connected.',
  'wrap');

// The next block is unlike the rest in this file because it doesn't
// have a "side" argument.
Blockly.Blocks['peripheral_get_names'] = {
  // Block for getting the names of connected peripherals.
  init: function() {
    this.setColour(BlocklyLua.PERIPHERAL_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('get names of connected peripherals');
    this.setOutput(true, 'List');
    this.setHelpUrl(BlocklyLua.BASE_PERIPHERAL_HELP_URL_ + 'getNames');
    this.setTooltip('Returns the names of any peripherals connected \n' +
                    'directly or through a wired modem.');
  }
};

Blockly.Lua['peripheral_get_names'] = function(block) {
  // Generate Lua for getting the names of connected peripherals.
  var code = 'peripheral.getNames()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

// The rest of this file is devoted to the block 'peripheral_call',
// which calls a method on an attached peripheral with an arbitrary
// number of named (method) arguments.  The arguments to this block are:
// First argument: side (as above)
// Second argument: method name
// Any number of subsequent arguments to be passed to method.
// This will override (and explicitly call) most of the prototype's methods.
Blockly.Blocks['peripheral_call'] = new BlockWithSide(
  'peripheral_call',
  'call method',
  null,
  'Calls a method on a connected peripheral. \n' +
      'Click on the star to add parameters.',
  'call');

Blockly.Blocks['peripheral_call'].init = function() {
  // Call prototype's init method to set up basics, including side.
  BlockWithSide.prototype.init.call(this);
  // Add mutator.
  this.setMutator(new Blockly.Mutator(['peripheral_mutatorarg']));
  this.arguments_ = [];
  // Add additional inputs.
  this.appendValueInput('METHOD')
      .setCheck('String');
  this.appendDummyInput('ON')
      .appendTitle('on peripheral');
  this.moveInputBefore('METHOD', 'SIDE')
  this.moveInputBefore('ON', 'SIDE')
  this.appendDummyInput()
      .appendTitle('', 'PARAMS');
  // Override default code generator.
  Blockly.Lua['peripheral_call'] = function(block) {
    // Generate Lua for calling a method on an attached peripheral.
    var side = block.cableMode ?
        (Blockly.Lua.valueToCode(block, 'CABLE', Blockly.Lua.ORDER_NONE) || '')
        :  block.getTitleValue('SIDES');
    var method = Blockly.Lua.valueToCode(
      block, 'METHOD', Blockly.Lua.ORDER_NONE) || '';
    var code = 'peripheral.call(\'' + side + '\', ' + method;
    for (var x = 1; this.getInput('PARAM' + x); x++) {
      code += ', ' +
          Blockly.Lua.valueToCode(block, 'PARAM' + x, Blockly.Lua.ORDER_NONE);
    }
    code += ')';
    return [code, Blockly.Lua.ORDER_HIGH];
  };
};

Blockly.Blocks['peripheral_call'].enterCableMode = function() {
  BlockWithSide.prototype.enterCableMode.call(this);
  if (this.getInput('PARAM1')) {
    this.moveInputBefore('CABLE', 'PARAM1');
  }
};

// Allow the user to add named inputs for the run-time method call.
Blockly.Blocks['peripheral_call'].decompose = function(workspace) {
  var containerBlock = new Blockly.Block(workspace,
      'peripheral_mutatorcontainer');
  containerBlock.initSvg();
  var connection = containerBlock.getInput('STACK').connection;
  for (var x = 0; x < this.arguments_.length; x++) {
    var paramBlock = new Blockly.Block(workspace, 'peripheral_mutatorarg');
    paramBlock.initSvg();
    paramBlock.setTitleValue(this.arguments_[x], 'NAME');
    // Store the old location.
    paramBlock.oldLocation = x;
    connection.connect(paramBlock.previousConnection);
    connection = paramBlock.nextConnection;
  }
  return containerBlock;
};

Blockly.Blocks['peripheral_mutatorcontainer'] = {
  // Peripheral input container (for mutator dialog).
  init: function() {
    this.setColour(BlocklyLua.PERIPHERAL_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(Blockly.Msg.PERIPHERAL_MUTATORCONTAINER_TITLE);
    this.appendStatementInput('STACK');
    this.setTooltip('');
    this.contextMenu = false;
  }
};

Blockly.Blocks['peripheral_mutatorarg'] = {
  // Peripheral input (for mutator dialog).
  init: function() {
    this.setColour(BlocklyLua.PERIPHERAL_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('input')
        .appendTitle(new Blockly.FieldTextInput('x', this.validator), 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.contextMenu = false;
  },
  validator: function(newVar) {
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    return newVar || null;
  }
};

// This checks for duplicate parameter names (giving a warning),
// updates the inputs in this block.  If clauseBlock is provided,
// the inputs are connected to their prior children; it is not
// provided (or needed) when restoring the block from the DOM.
Blockly.Blocks['peripheral_call'].updateParams_ = function(clauseBlock) {
  // Check for duplicated arguments.
  var badArg = false;
  var hash = {};
  for (var x = 0; x < this.arguments_.length; x++) {
    if (hash['arg_' + this.arguments_[x].toLowerCase()]) {
      badArg = true;
      break;
    }
    hash['arg_' + this.arguments_[x].toLowerCase()] = true;
  }
  if (badArg) {
    this.setWarningText(
      'Warning: This call has duplicate input (argument) names.');
  } else {
    this.setWarningText(null);
  }
  // Remove any existing parameter inputs from this block.
  var x = 1;
  while (this.getInput('PARAM' + x)) {
    this.removeInput('PARAM' + x);
    x++;
  }
  // Add the parameter inputs to this block.
  for (var x = 1; x <= this.arguments_.length; x++) {
    var input = this.appendValueInput('PARAM' + x)
        .appendTitle(this.arguments_[x - 1]);
    // Restore any child nodes.
    if (clauseBlock && clauseBlock.valueConnection_) {
      input.connection.connect(clauseBlock.valueConnection_);
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
};

Blockly.Blocks['peripheral_call'].compose = function(containerBlock) {
  this.arguments_ = [];
  var paramBlock = containerBlock.getInputTargetBlock('STACK');
  while (paramBlock) {
    this.arguments_.push(paramBlock.getTitleValue('NAME'));
    paramBlock = paramBlock.nextConnection &&
        paramBlock.nextConnection.targetBlock();
  }
  this.updateParams_(containerBlock.getInputTargetBlock('STACK'));
};

Blockly.Blocks['peripheral_call'].saveConnections = function(containerBlock) {
  // Store a pointer to any connected child blocks.
  var clauseBlock = containerBlock.getInputTargetBlock('STACK');
  var x = 1;
  while (clauseBlock) {
    var input = this.getInput('PARAM' + x);
    clauseBlock.valueConnection_ = input && input.connection.targetConnection;
    clauseBlock = clauseBlock.nextConnection &&
        clauseBlock.nextConnection.targetBlock();
    x++;
  }
};

Blockly.Blocks['peripheral_call'].mutationToDom = function() {
  // Save cable state.
  var container = BlockWithSide.prototype.mutationToDom.call(this);
  // Save argument names.
  for (var x = 0; x < this.arguments_.length; x++) {
    var parameter = document.createElement('arg');
    parameter.setAttribute('name', this.arguments_[x]);
    container.appendChild(parameter);
  }
  return container;
};

Blockly.Blocks['peripheral_call'].domToMutation = function(xmlElement) {
  // Restore cable state.
  BlockWithSide.prototype.domToMutation.call(this, xmlElement);
  // Restore argument inputs.
  this.arguments_ = [];
  for (var x = 0, childNode; childNode = xmlElement.childNodes[x]; x++) {
    if (childNode.nodeName.toLowerCase() == 'arg') {
      this.arguments_.push(childNode.getAttribute('name'));
    }
  }
  this.updateParams_(null);
};
