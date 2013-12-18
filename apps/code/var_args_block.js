/**
 * Blockly Lua: ComputerCraft VarArgsBlock class
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
 * @fileoverview Class for ComputerCraft blocks that can have multiple
 *     copies of a single value input.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.provide('ComputerCraft.VarArgsBlock');

goog.require('ComputerCraft.ValueBlock');
goog.require('goog.asserts');

/**
 * Constructor for blocks with a var args input.
 *
 * None of the non-variable arguments should have names matching ARG%d+.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} info Information about the block being defined.
 *   Fields are the same as in its parent, ValueBlock, with the following
 *   exceptions:
 * - The var args input should appear as "%v" in info.text.
 * - The var args parameter should not appear in info.args.
 * There are these new info fields, only the first of which is required:
 * - !varArgName (e.g., "argument"), which appears in the mutator args.
 * - ?varArgType (e.g., "String"), which is used for type checking.
 * - ?varArgTitle (e.g., "with parameters"), which appears before the
 *   first parameter, if present.
 * - ?varArgField, an optional Field to appear in the mutator args.
 * - ?varArgCount (# of var args present)
 * - ?varContainerName (e.g., "arguments"), which appears in the mutator.
 * - ?varArgTooltip, which appears in the mutator.
 * - ?varContainerTooltip, which appears in the mutator.
 */
Blockly.ComputerCraft.VarArgsBlock = function(prefix, colour, info) {
  Blockly.ComputerCraft.Block.disallowArgTitle_(info.args,
      Blockly.ComputerCraft.VarArgsBlock.INPUT_NAME_REGEX_);
  goog.asserts.assert(info.varArgName,
    'this.info.varArgName should have name of the mutator arg.');
  Blockly.ComputerCraft.VarArgsBlock.superClass_.constructor.call(
    this, prefix, colour, info);
}
goog.inherits(Blockly.ComputerCraft.VarArgsBlock,
    Blockly.ComputerCraft.ValueBlock);

// Regular expression matching the name of var args inputs.
Blockly.ComputerCraft.VarArgsBlock.INPUT_NAME_REGEX_ = /^ARG\d+$/;

Blockly.ComputerCraft.VarArgsBlock.prototype.addVarArg = function(x) {
  var input = this.appendValueInput('ARG' + x)
      .setCheck(this.info.varArgType);
  if (x == 1 && this.info.varArgTitle) {
    input.appendTitle(this.info.varArgTitle);
  }
  this.moveNumberedInputBefore(
    this.inputList.length - 1,
    this.info.varArgPos + x - 1);
  return input;
};

Blockly.ComputerCraft.VarArgsBlock.prototype.init = function() {
  // Replace %v in info.text with dummy input, if it hasn't yet been replaced.
  this.info.text = this.info.text.replace('%v', '%0');

  Blockly.ComputerCraft.ValueBlock.prototype.init.call(this);

  // Find the name of the input after the dummy input.
  var x = 0;
  while (this.inputList[x].type != Blockly.DUMMY_INPUT) {
    x++;
  }
  this.info.varArgPos = x + 1;

  // Add initial var args if not already present.
  this.info.varArgCount = this.info.varArgCount || 0;
  for (var x = 1; x <= this.info.varArgCount; x++) {
    this.addVarArg(x);
  }

  // Setup mutator.
  var thisBlock = this;
  Blockly.Blocks[this.blockName + '_mutator_arg'] = {
    init: function() {
      this.setColour(thisBlock.colour)
      var input = this.appendDummyInput()
          .appendTitle(new Blockly.FieldLabel(thisBlock.info.varArgName));
      if (thisBlock.info.varArgField) {
        input.appendTitle(thisBlock.info.varArgField.clone());
      }
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(thisBlock.info.varArgTooltip || '');
      this.contextMenu = false;
    }
  };
  Blockly.Blocks[this.blockName + '_mutator_container'] = {
    init: function() {
      this.setColour(thisBlock.colour);
      this.appendDummyInput()
          .appendTitle(thisBlock.info.varContainerName || '');
      this.appendStatementInput('STACK');
      this.setTooltip(thisBlock.info.varContainerTooltip || '');
      this.contextMenu = false;
    }
  };
  this.setMutator(new Blockly.Mutator([this.blockName + '_mutator_arg']));
};

// Create mutator from program block.
Blockly.ComputerCraft.VarArgsBlock.prototype.decompose = function(workspace) {
  var containerBlock =
      new Blockly.Block(workspace, this.blockName + '_mutator_container');
  containerBlock.initSvg();
  var connection = containerBlock.getInput('STACK').connection;
  for (var x = 1; x <= this.info.varArgCount; x++) {
    var argBlock =
        new Blockly.Block(workspace, this.blockName + '_mutator_arg');
    argBlock.initSvg();
    connection.connect(argBlock.previousConnection);
    connection = argBlock.nextConnection;
  }
  return containerBlock;
};

// Update program block to reflect mutator.
Blockly.ComputerCraft.VarArgsBlock.prototype.compose = function(containerBlock) {
  // Remove existing var args inputs from real block.
  for (var x = 1; x <= this.info.varArgCount; x++) {
    this.removeInput('ARG' + x);
  }

  // Add var args inputs.
  var clauseBlock = containerBlock.getInputTargetBlock('STACK');
  var x = 1;
  while (clauseBlock) {
    // Create an input in the program block.
    var input = this.addVarArg(x);
    // Reconnect any child block.
    if (clauseBlock.valueConnection_) {
      input.connection.connect(clauseBlock.valueConnection_);
    }
    // Advance to the next mutator argument block.
    clauseBlock = clauseBlock.nextConnection &&
        clauseBlock.nextConnection.targetBlock();
    x += 1;
  }
  this.info.varArgCount = x - 1;
};

Blockly.ComputerCraft.VarArgsBlock.prototype.saveConnections =
    function(containerBlock) {
      var clauseBlock = containerBlock.getInputTargetBlock('STACK');
      var x = 1;
      while (clauseBlock) {
        var input = this.getInput('ARG' + x);
        clauseBlock.valueConnection_ =
            input && input.connection.targetConnection;
        clauseBlock = clauseBlock.nextConnection &&
            clauseBlock.nextConnection.targetBlock();
        x++;
      }
};

Blockly.ComputerCraft.VarArgsBlock.prototype.mutationToDom = function() {
  var container = document.createElement('mutation');
  if (this.info.varArgCount) {
    container.setAttribute('var_arg_count', this.info.varArgCount);
  }
  return container;
}

Blockly.ComputerCraft.VarArgsBlock.prototype.domToMutation =
    function(xmlElement) {
      this.info.varArgCount =
          parseInt(xmlElement.getAttribute('var_arg_count'), 10);
      for (var x = 1; x <= this.info.varArgCount; x++) {
        // The guard is necessary, because the var args inputs may have
        // already been added in init if this.info.varArgCount was set.
        if (!this.getInput('ARG' + x)) {
          this.appendValueInput('ARG' + x)
              .setCheck(this.info.varArgType);
          // Move the block into the proper position.
          this.moveNumberedInputBefore(
            this.inputList.length - 1,
            this.info.varArgPos + x - 1);
        }
      }
};

/**
 * Create a block with a var arg input.  The other inputs must be
 * value inputs.  (This inherits from ValueBlock.)
 *
 * This also creates a Lua code generator.  It outputs code for the
 * inputs in the order in which they appear in info.args (not their
 * order in blocks.inputList), followed by the var args.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} info Information about the block being defined.
 *     This adds no fields to the ones used by the constructor
 *     Blockly.ComputerCraft.VarArgsBlock.
 * @return {Blockly.ComputerCraft.VarArgsBlock} The new block.
 */
Blockly.ComputerCraft.buildVarArgsBlock = function(prefix, colour, info) {
  var newBlock = new Blockly.ComputerCraft.VarArgsBlock(prefix, colour, info);
  Blockly.Blocks[newBlock.blockName] = newBlock;
  Blockly.Lua[newBlock.blockName] = Blockly.ComputerCraft.Block.prototype.
      generateLua;
  return newBlock;
};

Blockly.ComputerCraft.VarArgsBlock.prototype.getOrderedParameterNames =
    function() {
      // Take regular parameters in order.
      var order = Blockly.ComputerCraft.ValueBlock.prototype.
          getOrderedParameterNames.call(this);
      // Add varargs inputs to the end.
      for (var i = 1; i <= this.info.varArgCount; i++) {
        order.push('ARG' + i);
      }
      return order;
    };
