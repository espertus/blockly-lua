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
goog.require('ComputerCraft.SideInputBlock');
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.PERIPHERAL_BLOCK_COLOUR_ = 65;

Blockly.ComputerCraft.PERIPHERAL_FUNCS_ = [
  {funcName: 'isPresent',
   output: 'Boolean',
   text: 'is peripheral present',
   tooltip:
   'Return true if a peripheral is connected on the specified side.'},
  {funcName: 'getType',
   output: 'String',
   text: 'get type of peripheral',
   tooltip:
   'Return the type of the connected peripheral or nil if none present'},
  {funcName: 'getMethods',
   output: 'List',
   text: 'get method names of peripheral',
   tooltip:
   'Return a list of the names of the connected peripheral\'s methods,\n' +
   'or nil if no peripheral is connected.'},
  {funcName: 'wrap',
   output: 'List',
   text: 'wrap peripheral',
   tooltip:
   'Return the connected peripheral\'s methods so they can be called,\n' +
   'or nil if no peripheral is connected.'}];

Blockly.ComputerCraft.PERIPHERAL_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildSideInputBlock(
    'peripheral', Blockly.ComputerCraft.PERIPHERAL_BLOCK_COLOUR_, info);});

// The next block is unlike the rest in this file because it doesn't
// have a "side" argument.  It is a simple value block.
Blockly.ComputerCraft.buildValueBlock(
  'peripheral', Blockly.ComputerCraft.PERIPHERAL_BLOCK_COLOUR_,
  {funcName: 'getNames',
   output: 'List',
   text: 'get names of connected peripherals',
   args: [],
   tooltip:
   'Returns the names of any peripherals connected\n' +
   'directly or through a wired modem.'});

// The rest of this file is devoted to the block 'peripheral_call',
// which calls a method on an attached peripheral with an arbitrary
// number of named (method) arguments.  The arguments to this block are:
// First argument: side (as above)
// Second argument: method name
// Any number of subsequent arguments to be passed to method.
// This will override (and explicitly call) most of the prototype's methods.
// I had to do this the hard way (instead of using VarArgsBlock) because
// this also has a dependent input.
Blockly.ComputerCraft.buildSideInputBlock(
  'peripheral',
  Blockly.ComputerCraft.PERIPHERAL_BLOCK_COLOUR_,
  {funcName: 'call',
   text: 'call method %1 on peripheral',
   args: [['METHOD', 'String']],
   tooltip: 'Calls a method on a connected peripheral.\n' +
   'Click on the star to add parameters.',
   helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_DIR});

Blockly.Blocks['peripheral_call'].init = function() {
  // Call prototype's init method to set up basics, including side.
  Blockly.ComputerCraft.SideInputBlock.prototype.init.call(this);
  // Add mutator.
  this.setMutator(new Blockly.Mutator(['peripheral_mutatorarg']));
  this.arguments_ = [];
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
    this.setColour(Blockly.ComputerCraft.PERIPHERAL_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('arguments');
    this.appendStatementInput('STACK');
    this.setTooltip('');
    this.contextMenu = false;
  }
};

Blockly.Blocks['peripheral_mutatorarg'] = {
  // Peripheral input (for mutator dialog).
  init: function() {
    this.setColour(Blockly.ComputerCraft.PERIPHERAL_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('argument')
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
  var container =
      Blockly.ComputerCraft.SideInputBlock.prototype.mutationToDom.call(this);
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
  Blockly.ComputerCraft.SideInputBlock.prototype.domToMutation.call(
    this, xmlElement);
  // Restore argument inputs.
  this.arguments_ = [];
  for (var x = 0, childNode; childNode = xmlElement.childNodes[x]; x++) {
    if (childNode.nodeName.toLowerCase() == 'arg') {
      this.arguments_.push(childNode.getAttribute('name'));
    }
  }
  this.updateParams_(null);
};
