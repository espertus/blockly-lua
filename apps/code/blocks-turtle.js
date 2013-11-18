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

Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ = Blockly.ComputerCraft.BASE_HELP_URL + 'Turtle.';
Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_ = 120;


// Block for moving forward, back, up, or down.
Blockly.Blocks['turtle_move'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_move'].init = function() {
  var DIRECTIONS =
      [['move forward', 'forward'],
       ['move backward', 'back'],
       ['move up', 'up'],
       ['move down', 'down']];
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendDummyInput()
      .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
  this.setOutput(true, 'Boolean');
  this.setTooltip(
    'Try to move the turtle in the specified direction,\n' +
        'returning true if successful, false if the way is blocked.');
  var thisBlock = this;
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
  });
},
Blockly.Blocks['turtle_move'].multipleOutputs = 2;

Blockly.Lua['turtle_move'] = function(block) {
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return block.adjustCode(code);
};


// Block for turning left or right.
Blockly.Blocks['turtle_turn'] = {
    init: function() {
    var DIRECTIONS =
        [['turn right', 'turnRight'],
         ['turn left', 'turnLeft']];
    this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turn 90 degrees in the specified direction.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  }
};

Blockly.Lua['turtle_turn'] = function(block) {
  return 'turtle.' + block.getTitleValue('DIR') + '()\n';
};


// Block for digging in front, above, or below the turtle.
Blockly.Blocks['turtle_dig'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_dig'].init = function() {
  var DIRECTIONS =
      [['dig in front', 'dig'],
       ['dig up', 'digUp'],
       ['dig down', 'digDown']];
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendDummyInput()
      .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
  this.setOutput(true, 'Boolean');
  this.setTooltip(
    'Try to dig in the specified direction, returning true if successful,\n' +
        'false otherwise (for example, if the block is empty\n' +
        'or bedrock is encountered).');
  var thisBlock = this;
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
  })
};

Blockly.Blocks['turtle_dig'].multipleOutputs = 2;

Blockly.Lua['turtle_dig'] = function(block) {
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return block.adjustCode(code);
};


// Block for attacking in front, above, or below the turtle.
Blockly.Blocks['turtle_attack'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_attack'].init = function() {
  var DIRECTIONS =
      [['attack in front', 'attack'],
       ['attack up', 'attackUp'],
       ['attack down', 'attackDown']];
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendDummyInput()
      .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
  this.setOutput(true, 'Boolean');
  this.setTooltip(
    'Attack in the specified direction, returning true\n' +
        'if something was hit, false otherwise.');
  var thisBlock = this;
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
  })
};

Blockly.Blocks['turtle_attack'].multipleOutputs = 2;

Blockly.Lua['turtle_attack'] = function(block) {
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return block.adjustCode(code);
};


// Block for detecting in front, above, or below the turtle.
Blockly.Blocks['turtle_detect'] = {
  init: function() {
    var DIRECTIONS =
        [['detect in front', 'detect'],
         ['detect up', 'detectUp'],
         ['detect down', 'detectDown']];
    this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean');
    this.setTooltip(
      'Detect whether there is a block in the specified direction.\n' +
          'Mobs, liquids, and floating objects are not detected.\n' +
          'The result is true if a block was detected, false otherwise.');
  }
};

Blockly.Lua['turtle_detect'] = function(block) {
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return [code, Blockly.Lua.ORDER_HIGH];
};


// Block for placing an item from the selected slot in front of, above,
// or below the turtle.
Blockly.Blocks['turtle_place'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_place'].init = function() {
  var TYPES =
      [['item', 'item'],
       ['sign', 'sign']];
  var DIRECTIONS =
      [['in front', 'place'],
       ['up', 'placeUp'],
       ['below', 'placeDown']];
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
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
  this.setOutput(true, 'Boolean')
  this.setInputsInline(true);
  this.setTooltip(function() {
    if (thisBlock.getTitleValue('TYPE') == 'item') {
      return 'Place a block or item from the selected slot.\nThe result is true if successful, false otherwise.';
    } else {
      return 'Place a block or item from the selected slot.\nIf it is a sign, it will have the specified text.\nThe result is true if an item could be placed, false otherwise.';
    }});
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
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

Blockly.Blocks['turtle_place'].multipleOutputs = 2;

Blockly.Blocks['turtle_place'].mutationToDom = function() {
  var container = Blockly.ComputerCraft.ExpStmtBlock.prototype.mutationToDom.call(this);
  container.setAttribute('mode', this.getTitleValue('TYPE'));
  return container;
};

Blockly.Blocks['turtle_place'].domToMutation = function(xmlElement) {
  Blockly.ComputerCraft.ExpStmtBlock.prototype.domToMutation.call(this, xmlElement);
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
Blockly.Blocks['turtle_craft'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_craft'].init = function() {
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendValueInput('LIMIT')
      .setCheck('Number')
      .appendTitle('craft')
      .permitsAll = true;
  this.setOutput(true, 'Boolean');
  this.setTooltip(
    'Craft items using ingredients in the turtle\'s inventory when they\'re\n' +
        'in a valid recipe pattern,placing the result in the currently ' +
        'selected slot.\n' +
        'Returns true if items are crafted.\n' +
        'If no limit is provided, the turtle will make as many as possible ' +
        '(maximum 64).\n' +
        'If a limit of 0 is supplied, no items will be consumed,\n' +
        'but the return value will indicate whether a valid recipe is present.'
  );
  this.setHelpUrl(Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + 'craft');
};

Blockly.Blocks['turtle_craft'].multipleOutputs = 2;

Blockly.Lua['turtle_craft'] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(block, 'LIMIT',
                                          Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.craft(' + argument0 + ')';
  return block.adjustCode(code);
}


// Block for selecting a slot.
Blockly.Blocks['turtle_select'] = new Blockly.ComputerCraft.ExpStmtBlock();
Blockly.Blocks['turtle_select'].init = function() {
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendValueInput('VALUE')
      .setCheck('Number')
      .appendTitle('select slot #');
  this.setTooltip(
    'Select the slot to use (1-16) for subsequent craft, drop, etc., commands.'
  );
  this.setHelpUrl(Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + 'select');
};

Blockly.Blocks['turtle_select'].multipleOutputs = 2;

Blockly.Lua['turtle_select'] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE',
                                          Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.select(' + argument0 + ')';
  return block.adjustCode(code);
}


// Block for comparing the specified block to the contents of the
// selected slot.
Blockly.Blocks['turtle_compare'] = {
  init: function() {
    var DIRECTIONS =
        [['compare front item to selected slot', 'compare'],
         ['compare above item to selected slot', 'compareUp'],
         ['compare below item to selected slot', 'compareDown']];
    this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip(
      'Check if the block in the world is the same as the blocks\n'  +
          'in the selected slot of the turtle\'s inventory.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
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
    this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
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
Blockly.Blocks['turtle_compare_to'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_compare_to'].init = function() {
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendValueInput('VALUE')
      .setCheck('Number')
      .appendTitle('compare item in selected slot to slot');
  this.setOutput(true, 'Boolean');
  this.setTooltip(
    'Compares the currently selected slot and the specified slot,\n' +
        'returning true if they\'re the same, false if not.');
};

Blockly.Lua['turtle_compare_to'] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE',
                                          Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.compareTo(' + argument0 + ')';
  return block.adjustCode(code);
}


// Block for dropping items.
Blockly.Blocks['turtle_drop'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_drop'].init = function() {
  var DIRECTIONS =
      [['in front', 'drop'],
       ['up', 'dropUp'],
       ['down', 'dropDown']];
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendDummyInput()
      .appendTitle('drop');
  this.appendValueInput('VALUE')
      .setCheck('Number')
      .permitsAll = true;
  this.appendDummyInput()
      .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
  this.setOutput(true, 'Boolean')
  this.setInputsInline(true);
  this.setTooltip(
    'Drops the supplied amount of items in the selected slot.\n' +
        'If an inventory such as a chest is on that side of the turtle,\n' +
        'it will try to place into the inventory,\n' +
        'returning false if the inventory is full.');
  var thisBlock = this;
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
  });
};

Blockly.Blocks['turtle_drop'].multipleOutputs = 2;

Blockly.Lua['turtle_drop'] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(
    block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.' + block.getTitleValue('DIR') + '(' + argument0 + ')';
  return block.adjustCode(code);
};


// Block for getting the turtle to pick up or take items from the ground or
// an inventory, respectively.
Blockly.Blocks['turtle_suck'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_suck'].init = function() {
  var DIRECTIONS =
      [['suck in front', 'suck'],
       ['suck up', 'suckUp'],
       ['suck down', 'suckDown']];
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendDummyInput()
      .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
  this.setOutput(true, 'Boolean')
  this.setTooltip(
    'Picks up an item stack of any size from the ground\n' +
        'or an inventory (such as a chest) on that side\n' +
        'and places in the selected slot.\n' +
        'Returns true if the turtle can pick up an item.');
  var thisBlock = this;
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
  });
};

Blockly.Blocks['turtle_suck'].multipleOutputs = 2;

Blockly.Lua['turtle_suck'] = function(block) {
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return block.adjustCode(code);
};


// Block for refuelling the turtle.
Blockly.Blocks['turtle_refuel'] = new Blockly.ComputerCraft.ExpStmtBlock();
Blockly.Blocks['turtle_refuel'].init = function() {
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendValueInput('VALUE')
      .setCheck('Number')
      .appendTitle('refuel')
      .permitsAll = true;
  this.setOutput(true, 'Boolean');
  this.setTooltip(
    'Refuels the turtle using a fuel item in the selected slot,\n' +
        'returning whether it was successful.\n' +
        'If an input of 0 is supplied, no items will be consumed,\n' +
        'but the return value will indicate if the item can be used as fuel.');
  this.setHelpUrl(function() {
    return Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + 'refuel';
  });
};

Blockly.Blocks['turtle_refuel'].multipleOutputs = 2;

Blockly.Lua['turtle_refuel'] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(
    block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.refuel(' + argument0 + ')';
  return block.adjustCode(code);
}


// Block for getting the turtle's fuel level
Blockly.Blocks['turtle_get_fuel_level'] = {
  init: function() {
    this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('get fuel level');
    this.setOutput(true, 'Number');
    this.setTooltip(
      'Returns the current fuel level of the turtle,\n' +
          'which is the number of blocks the turtle can move.\n' +
          'If fuel is turned off in the ComputerCraft configuration file,\n' +
          'this will return "unlimited".');
  }
};

Blockly.Lua['turtle_get_fuel_level'] = function(block) {
  var code = 'turtle.getFuelLevel()';
  return Blockly.ComputerCraft.HELPER_FUNCTIONS.generatedCode(block, code);
}


// Block for transferring an item from the currently selected slot to the
// specified slot.
Blockly.Blocks['turtle_transfer_to'] = new Blockly.ComputerCraft.ExpStmtBlock();

Blockly.Blocks['turtle_transfer_to'].init = function() {
  this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
  this.appendValueInput('QUANTITY')
      .setCheck('Number')
      .appendTitle('transfer')
      .permitsAll = true;
  this.appendValueInput('SLOT')
      .setCheck('Number')
      .appendTitle('items from selected slot to slot');
  this.setInputsInline(true);
  this.setOutput(true, 'Boolean');
  this.setHelpUrl(Blockly.ComputerCraft.BASE_TURTLE_HELP_URL_ + 'transferTo');
  this.setTooltip('Transfers items from the currently selected slot\n' +
                  ' to the specified, returning whether it was successful.');
};

Blockly.Blocks['turtle_transfer_to'].multipleOutputs = 2;

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
