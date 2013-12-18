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
 * @fileoverview Blocks for ComputerCraft turtles.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.DependentInputBlock');
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.Turtle = {};

Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_ = 120;

Blockly.ComputerCraft.Turtle.QUANTITY_ALL_ = 'QUANTITY_ALL';

// Blocks that switch between statement and expression.
// Some contain a direction, such as turn right/left.
Blockly.ComputerCraft.TURTLE_DIR_FUNCS_ = [
  {blockName: 'turn',
   directions:
   [['turn right', 'turnRight'],
    ['turn left', 'turnLeft']],
   tooltip: 'Turn 90 degrees in the specified direction.'},
  {blockName: 'move',
   directions:
   [['move forward', 'forward'],
    ['move backward', 'back'],
    ['move up', 'up'],
    ['move down', 'down']],
   tooltip:
   'Try to move the turtle in the specified direction,\n' +
   'returning true if successful, false if the way is blocked.'},
  {blockName: 'dig',
   directions:
   [['dig in front', 'dig'],
    ['dig up', 'digUp'],
    ['dig down', 'digDown']],
   tooltip:
   'Try to dig in the specified direction, returning true if successful,\n' +
   'false otherwise (e.g., if the block is empty or bedrock encountered).'},
  {blockName: 'attack',
   directions: [['attack in front', 'attack'],
                ['attack up', 'attackUp'],
                ['attack down', 'attackDown']],
   tooltip:
   'Attack in the specified direction, returning\n' +
   'true if something was hit, false otherwise.'},
  {blockName: 'detect',
  directions: [['detect in front', 'detect'],
               ['detect up', 'detectUp'],
               ['detect down', 'detectDown']],
   tooltip:
   'Detect whether there is a block in the specified direction.\n' +
   'Mobs, liquids, and floating objects are not detected.\n' +
   'The result is true if a block was detected, false otherwise.'},
  {blockName: 'suck',
   directions:
   [['suck in front', 'suck'],
    ['suck up', 'suckUp'],
    ['suck down', 'suckDown']],
   tooltip:
   'Picks up an item stack of any size from the ground\n' +
   'or an inventory (such as a chest) on that side\n' +
   'and places in the selected slot.\n' +
   'Returns true if the turtle can pick up an item.'},
  {funcName: 'select',
   text: 'select slot #%1',
   args: [['VALUE', 'Number']],
   tooltip:
   'Select the slot to use (1-16) for subsequent\n' +
   'craft, drop, etc., commands.  Returns true if\n' +
   'the input was in range, false otherwise.'},
  // The remaining blocks permit "all" as an argument.
  {blockName: 'drop',
   text: 'drop %1 %2',
   // directions will be added to args below.
   directions:
   [['in front', 'drop'],
    ['up', 'dropUp'],
    ['down', 'dropDown']],
   args: [[Blockly.ComputerCraft.Turtle.QUANTITY_ALL_, 'Number']],
   tooltip:
   'Drops the supplied amount of items in the selected slot.\n' +
   'If an inventory such as a chest is on that side of the turtle,\n' +
   'it will try to place into the inventory,\n' +
   'returning false if the inventory is full.'},
  {funcName: 'craft',
   text: 'craft %1',
   args: [[Blockly.ComputerCraft.Turtle.QUANTITY_ALL_, 'Number']],
   tooltip:
   'Craft items using ingredients in the turtle\'s inventory when they\'re\n' +
   'in a valid recipe pattern,placing the result in the currently ' +
   'selected slot.\n' +
   'Returns true if items are crafted.\n' +
   'If no limit is provided, the turtle will make as many as possible ' +
   '(maximum 64).\n' +
   'If a limit of 0 is supplied, no items will be consumed,\n' +
   'but the return value will indicate whether a valid recipe is present.'},
  {funcName: 'refuel',
   text: 'refuel %1',
   args: [[Blockly.ComputerCraft.Turtle.QUANTITY_ALL_, 'Number']],
   tooltip:
   'Refuels the turtle using a fuel item in the selected slot,\n' +
   'returning whether it was successful.\n' +
   'If an input of 0 is supplied, no items will be consumed,\n' +
   'but the return value will indicate if the item can be used as fuel.'},
  {funcName: 'transferTo',
   text: 'transfer %2 items from selected slot to slot %1',
   args: [['SLOT', 'Number'],
          [Blockly.ComputerCraft.Turtle.QUANTITY_ALL_, 'Number']],
   tooltip:
   'Transfers items from the currently selected slot\n' +
   'to the specified, returning whether it was successful.'}];

Blockly.ComputerCraft.TURTLE_DIR_FUNCS_.forEach(function(info) {
  if (info.directions) {
    if (!info.text) {
      info.text = '%1';
    }
    if (!info.args) {
      info.args = [];
    }
    info.args.unshift(
      ['DIRECTIONS', new Blockly.FieldDropdown(info.directions)]);
    info.ddFuncName = 'DIRECTIONS';
    info.helpUrlType = Blockly.ComputerCraft.HelpUrlType.PREFIX_DD;
  } else {
    info.helpUrlType = Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME;
  }
  info.output = 'Boolean';  // first output
  info.multipleOutputs = 2;
  info.expStmt = true;
  var newBlock = Blockly.ComputerCraft.buildValueBlock(
    'turtle', Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_, info);
  if (info.args.some(
    function(arg) {
      return arg[0] == Blockly.ComputerCraft.Turtle.QUANTITY_ALL_;
    })) {
    Blockly.Lua[newBlock.blockName] = function(block) {
      var argNames = block.info.args.map(function(arg) {return arg[0];});
      var args = argNames.filter(
        function(name) {
          return name != Blockly.ComputerCraft.Turtle.QUANTITY_ALL_ ||
              !block.getInputTargetBlock(name) ||
              !block.getInputTargetBlock(name).isAll;
        });
      return Blockly.ComputerCraft.generateLua(block, args);
    }
  }
});

// Block to indicate that an operation should be applied to as many items as
// possible.  When generating code, this argument should be omitted.
Blockly.Blocks['turtle_all'] =  {
  isAll: true,
  init: function() {
    this.setColour(230);   // math color
    this.appendDummyInput()
        .appendTitle('all');
    this.setOutput(true, 'Number');  // This is a white lie.
    this.setTooltip(
        'Indicates that certain operations should be done to all items.');
    // No help URL.
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    // Determine whether the input to which this is connected permitsAll.
    if (this.outputConnection && this.outputConnection.targetConnection) {
      var sourceBlock = this.outputConnection.targetConnection.sourceBlock_;
      for (var i = 0; i < sourceBlock.inputList.length; i++) {
        var input = sourceBlock.inputList[i];
        // Check whether this input is connected to anything.
        if (input.connection && input.connection.targetConnection) {
          var inputBlock = input.connection.targetConnection.sourceBlock_;
          // If the input is connected to the "all" block, see if the input
          // permits it.
          if (inputBlock == this) {
            if (input.name == Blockly.ComputerCraft.Turtle.QUANTITY_ALL_) {
              this.setWarningText(null);
            } else {
              this.setWarningText('This slot cannot accept "all" as an input.');
            }
          }
        }
      }
    }
  }
};

// This should only be needed if code is generated while the "all" block is not
// properly connected.  Just return something so as not to blow up.
Blockly.Lua['turtle_all'] = function(block) {
  return ['', Blockly.Lua.ORDER_NONE];
};

Blockly.ComputerCraft.buildDependentInputBlock(
  'turtle',
  Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_,
  {blockName: 'place',
   text: 'place %1 %2 %3',
   args:
   [['TYPE*', [['item', 'item'],
              ['sign', 'sign*']]],
    ['DIRECTION', [['in front', 'place'],
                   ['up', 'placeUp'],
                   ['below', 'placeDown']]],
    ['TEXT^', 'String']],
   ddFuncName: 'DIRECTION',
   depTitle: 'with text',
   output: 'Boolean',
   multipleOutputs: true,
   expStmt: true,
   tooltip: function(block) {
    if (block.getTitleValue('TYPE') == 'item') {
      return 'Place a block or item from the selected slot.\n' +
          'The result is true if successful, false otherwise.';
    } else {
      return 'Place a block or item from the selected slot.\n' +
          'If it is a sign, it will have the specified text.\n' +
          'The result is true if an item could be placed, false otherwise.';
    }
   }
  }
);

// Ordinary value blocks.
Blockly.ComputerCraft.TURTLE_VALUE_FUNCS_ = [
  {blockName: 'compare',
   text: '%1',
   args: [['DIRECTIONS', new Blockly.FieldDropdown(
     [['compare front item to selected slot', 'compare'],
      ['compare above item to selected slot', 'compareUp'],
      ['compare below item to selected slot', 'compareDown']])]],
   ddFuncName: 'DIRECTIONS',
   output: 'Boolean',
   tooltip:
   'Check if the block in the world is the same as the blocks\n'  +
   'in the selected slot of the turtle\'s inventory.'},
  {blockName: 'get_slot_info',
   text: 'get %1 in slot %2',
   args: [['CHOICE',
           new Blockly.FieldDropdown(
             [['item count', 'getItemCount'],
              ['free space', 'getItemSpace']])],
          ['SLOT', 'Number']],
   ddFuncName: 'CHOICE',
   output: 'Number',
   tooltip: function(block) {
     if (block.getTitleValue('CHOICE') == 'getItemCount') {
       return 'Get the count of items in the numbered slot.';
     } else {
       // Cannot break line between return and string, or else null
       // may be returned due to a shift-reduce error.
       return 'Get the number of additional items that can be placed in the ' +
           'numbered slot.';
     }
   }
  },
  {funcName: 'compareTo',
   text: 'compare item in selected slot to slot %1',
   args: [['VALUE', 'Number']],
   output: 'Boolean',
   tooltip:
   'Compares the currently selected slot and the specified slot,\n' +
   'returning true if they\'re the same, false otherwise.'},
  {funcName: 'getFuelLevel',
   text: 'get fuel level',
   output: ['Number', 'String'],
   tooltip:
   'Returns the current fuel level of the turtle,\n' +
   'which is the number of blocks the turtle can move.\n' +
   'If fuel is turned off in the ComputerCraft configuration file,\n' +
   'this will return "unlimited".'}
];

Blockly.ComputerCraft.TURTLE_VALUE_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'turtle', Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_, info);
});
