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

Blockly.ComputerCraft.Turtle = {};

Blockly.ComputerCraft.Turtle.BASE_HELP_URL_ =
    Blockly.ComputerCraft.BASE_HELP_URL + 'Turtle.';
Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_ = 120;

// Block for turning left or right.
Blockly.Blocks['turtle_turn'] = {
  init: function() {
    var DIRECTIONS =
        [['turn right', 'turnRight'],
         ['turn left', 'turnLeft']];
    this.setColour(Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turn 90 degrees in the specified direction.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return Blockly.ComputerCraft.Turtle.BASE_HELP_URL_ +
          + thisBlock.getTitleValue('DIR');});
  }
};

Blockly.Lua['turtle_turn'] = function(block) {
  return 'turtle.' + block.getTitleValue('DIR') + '()\n';
};

Blockly.ComputerCraft.Turtle.buildExpStmtBlock = function(func) {
  if (!func.helpUrlType) {
    func.helpUrlType = func.directions ?
        Blockly.ComputerCraft.HelpUrlType.PREFIX_DIR
        : Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME;
  }
  Blockly.ComputerCraft.buildExpStmtBlock(
    'turtle', Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_, func);
};

// Block for moving forward, back, up, or down.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock(
  {blockName: 'move',
   tooltip: 'Try to move the turtle in the specified direction,\n' +
   'returning true if successful, false if the way is blocked.',
   directions:
   [['move forward', 'forward'],
    ['move backward', 'back'],
    ['move up', 'up'],
    ['move down', 'down']]
  });

// Block for digging in front, above, or below the turtle.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock({
  blockName: 'dig',
  tooltip:
  'Try to dig in the specified direction, returning true if ' +
      'successful,\n' +
      'false otherwise (for example, if the block is empty\n' +
      'or bedrock is encountered).',
  directions:
  [['dig in front', 'dig'],
   ['dig up', 'digUp'],
   ['dig down', 'digDown']]});

// Block for attacking in front, above, or below the turtle.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock({
  blockName: 'attack',
  tooltip: 'Attack in the specified direction, returning true\n' +
      'if something was hit, false otherwise.',
  directions: [['attack in front', 'attack'],
               ['attack up', 'attackUp'],
               ['attack down', 'attackDown']]});

// Block for detecting in front, above, or below the turtle.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock({
  blockName: 'detect',
  tooltip:
  'Detect whether there is a block in the specified direction.\n' +
      'Mobs, liquids, and floating objects are not detected.\n' +
      'The result is true if a block was detected, false otherwise.',
  directions: [['detect in front', 'detect'],
               ['detect up', 'detectUp'],
               ['detect down', 'detectDown']]});

// Block for placing an item from the selected slot in front of, above,
// or below the turtle.  There is special code to handle placing text on a sign.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock(
  {blockName: 'place',
   suppressLua: true});

Blockly.Blocks['turtle_place'].init = function() {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.init.call(this);
  var TYPES =
      [['item', 'item'],
       ['sign', 'sign']];
  var DIRECTIONS =
      [['in front', 'place'],
       ['up', 'placeUp'],
       ['below', 'placeDown']];
  this.appendDummyInput()
      .appendTitle('place');
  var thisBlock = this;
  this.appendDummyInput('TYPE')
      .appendTitle(
        new Blockly.FieldDropdown(
          TYPES,
          function(value) {
            if (value == 'item') {
              thisBlock.enterItemMode();
            } else {
              thisBlock.enterSignMode();
            }
          }),
        'TYPE');
  this.appendDummyInput('DIRECTION')
      .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
  this.setTooltip(function() {
    if (thisBlock.getTitleValue('TYPE') == 'item') {
      return 'Place a block or item from the selected slot.\n' +
          'The result is true if successful, false otherwise.';
    } else {
      return 'Place a block or item from the selected slot.\n' +
          'If it is a sign, it will have the specified text.\n' +
          'The result is true if an item could be placed, false otherwise.';
    }});
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.Turtle.BASE_HELP_URL_ +
        thisBlock.getTitleValue('DIR');
  });
};

Blockly.Blocks['turtle_place'].enterSignMode = function() {
  this.appendValueInput('TEXT')
      .setCheck('String')
      .appendTitle('with text');
  this.moveInputBefore('TEXT', 'DIRECTION');
};

Blockly.Blocks['turtle_place'].enterItemMode = function() {
  this.removeInput('TEXT', true);
};

Blockly.Blocks['turtle_place'].mutationToDom = function() {
  var container =
      Blockly.ComputerCraft.ExpStmtBlock.prototype.mutationToDom.call(this);
  container.setAttribute('mode', this.getTitleValue('TYPE'));
  return container;
};

Blockly.Blocks['turtle_place'].domToMutation = function(xmlElement) {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.domToMutation.call(
    this, xmlElement);
  if (xmlElement.getAttribute('mode') == 'sign') {
    this.enterSignMode();
  } else {
    this.enterItemMode();
  }
};

Blockly.Lua['turtle_place'] = function(block) {
  var code = 'turtle.' + block.getTitleValue('DIR') + '(' +
      (Blockly.Lua.valueToCode(block, 'TEXT', Blockly.Lua.ORDER_NONE) || '') +
      ')';
  return block.adjustCode(code);
};

// Block for crafting an item.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock({
  funcName: 'craft',
  tooltip:
  'Craft items using ingredients in the turtle\'s inventory when they\'re\n' +
      'in a valid recipe pattern,placing the result in the currently ' +
      'selected slot.\n' +
      'Returns true if items are crafted.\n' +
      'If no limit is provided, the turtle will make as many as possible ' +
      '(maximum 64).\n' +
      'If a limit of 0 is supplied, no items will be consumed,\n' +
      'but the return value will indicate whether a valid recipe is present.'});

Blockly.Blocks['turtle_craft'].init = function() {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.init.call(this);
  this.appendValueInput('LIMIT')
      .setCheck('Number')
      .appendTitle('craft')
      .permitsAll = true;
};

// Block for selecting a slot.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock(
  {funcName: 'select',
   tooltip: 'Select the slot to use (1-16) for subsequent craft, drop, ' +
   'etc., commands.',
   helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME});

Blockly.Blocks['turtle_select'].init = function() {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.init.call(this);
  this.appendValueInput('VALUE')
      .setCheck('Number')
      .appendTitle('select slot #');
};

// Block for comparing the specified block to the contents of the
// selected slot.  Note that this does not use any prototypes.
Blockly.Blocks['turtle_compare'] = {
  init: function() {
    var DIRECTIONS =
        [['compare front item to selected slot', 'compare'],
         ['compare above item to selected slot', 'compareUp'],
         ['compare below item to selected slot', 'compareDown']];
    this.setColour(Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip(
      'Check if the block in the world is the same as the blocks\n'  +
          'in the selected slot of the turtle\'s inventory.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return Blockly.ComputerCraft.Turtle.BASE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
};

Blockly.Lua['turtle_compare'] = function(block) {
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return [code, Blockly.Lua.ORDER_HIGH];
};


// Block for returning the number of items OR the available space in the
// selected slot.  This replaces the deprecated turtle_get_item_count and
// turtle_get_item_space blocks.
Blockly.Blocks['turtle_get_slot_info'] = {
  init: function() {
    var CHOICES = [['get item count in slot', 'Count'],
                   ['get free space in slot', 'Space']];
    this.setColour(Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(CHOICES), 'CHOICE');
    this.appendValueInput('SLOT')
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    var thisBlock = this;
    this.setTooltip(function() {
      if (thisBlock.getTitleValue('CHOICE') == 'Count') {
        return 'Get the count of items in the numbered slot.';
      } else {
        return
        'Get the number of items that can be placed in the numbered slot.';
      }
    });
  }
};

Blockly.Lua['turtle_get_slot_info'] = function(block) {
  var slot = Blockly.Lua.valueToCode(block, 'SLOT', Blockly.Lua.ORDER_NONE)
      || '1';  // Alternative value temporary until we enforce parameters.
  var code = 'turtle.getItem' + block.getTitleValue('CHOICE') +
      '(' + slot + ')';
  return [code, Blockly.Lua.ORDER_NONE];
};


// Block for comparing items in the selected slot and the supplied one.
Blockly.ComputerCraft.buildValueBlock(
  'turtle',
  Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_,
  {funcName: 'compareTo',
   output: 'Boolean',
   text: 'compare item in selected slot to slot %1',
   args: [['VALUE', 'Number']],
   tooltip: 'Compares the currently selected slot and the specified slot,\n' +
   'returning true if they\'re the same, false if not.'});


// Block for dropping items.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock(
  {blockName: 'drop',
   output: 'Boolean',
   directions:
   [['in front', 'drop'],
    ['up', 'dropUp'],
    ['down', 'dropDown']],
   helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_DIR,
   tooltip: 'Drops the supplied amount of items in the selected slot.\n' +
   'If an inventory such as a chest is on that side of the turtle,\n' +
   'it will try to place into the inventory,\n' +
   'returning false if the inventory is full.'});

Blockly.Blocks['turtle_drop'].init = function() {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.init.call(this);
  this.appendDummyInput('TITLE')
      .appendTitle('drop');
  this.moveInputBefore('TITLE', 'DIRECTIONS');
  this.appendValueInput('VALUE')
      .setCheck('Number')
      .permitsAll = true;
  this.moveInputBefore('VALUE', 'DIRECTIONS');
};

// Block for getting the turtle to pick up or take items from the ground or
// an inventory, respectively.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock({
  blockName: 'suck',
  tooltip:'Picks up an item stack of any size from the ground\n' +
      'or an inventory (such as a chest) on that side\n' +
      'and places in the selected slot.\n' +
      'Returns true if the turtle can pick up an item.',
  directions:
  [['suck in front', 'suck'],
   ['suck up', 'suckUp'],
   ['suck down', 'suckDown']]});


// Block for refuelling the turtle.
Blockly.ComputerCraft.Turtle.buildExpStmtBlock(
  {funcName: 'refuel',
   output: 'Boolean',
   helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME,
   tooltip:
   'Refuels the turtle using a fuel item in the selected slot,\n' +
   'returning whether it was successful.\n' +
   'If an input of 0 is supplied, no items will be consumed,\n' +
   'but the return value will indicate if the item can be used as fuel.'});

Blockly.Blocks['turtle_refuel'].init = function() {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.init.call(this);
  this.appendValueInput('VALUE')
      .setCheck('Number')
      .appendTitle('refuel')
      .permitsAll = true;
};

Blockly.Lua['turtle_refuel'] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(
    block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.refuel(' + argument0 + ')';
  return block.adjustCode(code);
}


// Block for getting the turtle's fuel level
Blockly.ComputerCraft.buildValueBlock(
  'turtle',
  Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_,
  {funcName: 'getFuelLevel',
   text: 'get fuel level',
   output: ['Number', 'String'],
   helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME,
   tooltip:
   'Returns the current fuel level of the turtle,\n' +
   'which is the number of blocks the turtle can move.\n' +
   'If fuel is turned off in the ComputerCraft configuration file,\n' +
   'this will return "unlimited".'});

// Block for transferring an item from the currently selected slot to the
// specified slot.
Blockly.Blocks['turtle_transfer_to'] =
    new Blockly.ComputerCraft.ExpStmtBlock(
      'turtle',
      Blockly.ComputerCraft.Turtle.BLOCK_COLOUR_,
      {blockName: 'transfer_to',
       output: 'Boolean',
       helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME,
       tooltip: 'Transfers items from the currently selected slot\n' +
       ' to the specified, returning whether it was successful.'});

Blockly.Blocks['turtle_transfer_to'].init = function() {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.init.call(this);
  this.appendValueInput('QUANTITY')
      .setCheck('Number')
      .appendTitle('transfer')
      .permitsAll = true;
  this.appendValueInput('SLOT')
      .setCheck('Number')
      .appendTitle('items from selected slot to slot');
};

Blockly.Lua['turtle_transfer_to'] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(
    block, 'SLOT', Blockly.Lua.ORDER_NONE) || '';
  var argument1 = Blockly.Lua.valueToCode(
    block, 'QUANTITY', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.transferTo(' + argument0 +
      (argument1 != '' ? ', ' + argument1 : '') + ')';
  return block.adjustCode(code);
};


// Block to indicate that an operation should be applied to as many items as
// possible.  The Turtle library omits the argument in this case.
Blockly.Blocks['turtle_all'] =  {
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
          var sb = input.connection.targetConnection.sourceBlock_;
          // If the input is connected to the "all" block, see if the input
          // permits it.
          if (sb == this) {
            if (input.permitsAll) {
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

Blockly.Lua['turtle_all'] = function(block) {
  // Generate code for block to indicate that an operation should be applied to
  // as many items as possible.  Specifically, this generates the empty string
  // because the absence of a parameter is how "all" is specified for the Turtle
  // API.  Note: turtle.transferTo() is a special case, since the optional
  // quantity argument is second.
  return ['', Blockly.Lua.ORDER_NONE];
};
