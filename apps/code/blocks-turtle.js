BASE_TURTLE_HELP_URL_ = BlocklyLua.BASE_HELP_URL + 'Turtle.';
TURTLE_BLOCK_COLOUR_ = 120;

Blockly.Blocks['turtle_move'] = {
  // Block for moving forward, back, up, or down.
  init: function() {
    var DIRECTIONS =
        [['move forward', 'forward'],
         ['move backward', 'back'],
         ['move up', 'up'],
         ['move down', 'down']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip('Try to move the turtle in the specified direction,\n' +
        'returning true if successful, false if the way is blocked.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_move'] = function(block) {
  // Generate Lua for moving forward, backwards, up, or down.
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_turn'] = {
  // Block for turning left or right.
  init: function() {
    var DIRECTIONS =
        [['turn right', 'turnRight'],
         ['turn left', 'turnLeft']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turn 90 degrees in the specified direction.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  }
};

Blockly.Lua['turtle_turn'] = function(block) {
  // Generate Lua for turning left or right.
  return 'turtle.' + block.getTitleValue('DIR') + '()\n';
};

Blockly.Blocks['turtle_dig'] = {
  // Block for digging in front, above, or below the turtle.
  init: function() {
    var DIRECTIONS =
        [['dig in front', 'dig'],
         ['dig up', 'digUp'],
         ['dig down', 'digDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean');
    this.setTooltip('Try to dig in the specified direction, returning true if successful,\nfalse otherwise (for example, if the block is empty\nor bedrock is encountered).');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    })
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_dig'] = function(block) {
  // Generate Lua for digging forward, up, or down.
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_attack'] = {
  // Block for attacking in front, above, or below the turtle.
  init: function() {
    var DIRECTIONS =
        [['attack in front', 'attack'],
         ['attack up', 'attackUp'],
         ['attack down', 'attackDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean');
    this.setTooltip('Attack in the specified direction, returning true\nif something was hit, false otherwise.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    })
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_attack'] = function(block) {
  // Generate Lua for attacking forward, up, or down.
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_detect'] = {
  // Block for detecting in front, above, or below the turtle.
  init: function() {
    var DIRECTIONS =
        [['detect in front', 'detect'],
         ['detect up', 'detectUp'],
         ['detect down', 'detectDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean');
    this.setTooltip('Detect whether there is a block in the specified direction.\nMobs, liquids, and floating objects are not detected.\nThe result is true if a block was detected, false otherwise.');
  }
};

Blockly.Lua['turtle_detect'] = function(block) {
  // Generate Lua for detecting forward, up, or down.
  return ['turtle.' + block.getTitleValue('DIR') + '()', Blockly.Lua.ORDER_HIGH];
};

Blockly.Blocks['turtle_place'] = {
  // Block for placing an item from the selected slot in front of, above,
  // or below the turtle.
  init: function() {
    var TYPES =
        [['item', 'item'],
         ['sign', 'sign']];
    var DIRECTIONS =
        [['in front', 'place'],
         ['up', 'placeUp'],
         ['below', 'placeDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
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
      if (block.getTitleValue('TYPE') == 'item') {
	return 'Place a block or item from the selected slot.\nThe result is true if successful, false otherwise.';
      } else {
	return 'Place a block or item from the selected slot.\nIf it is a sign, it will have the specified text.\nThe result is true if an item could be placed, false otherwise.';
      }});
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
  enterSignMode: function() {
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendTitle('with text');
    this.moveInputBefore('TEXT', 'DIRECTION');
  },
  enterItemMode: function() {
    this.removeInput('TEXT', true);
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: [
    function(block) {
      (BlocklyLua.HELPER_FUNCTIONS['mutationToDom'].bind(block))()
    },
    function(block) {
      var container = document.createElement('mutation');
      container.setAttribute('mode', block.getTitleValue('TYPE'));
      return container;
    }.bind(this)],
  domToMutation: [
    function(block) {
      return BlocklyLua.HELPER_FUNCTIONS['domToMutation'].bind(block);
    },
    // This function is just for turtle_place.  Do not copy it elsewhere.
    function(block) {
      return function(xmlElement) {
        if (xmlElement.getAttribute('mode') == 'sign') {
          block.enterSignMode();
        } else {
          block.enterItemMode();
        }
      }
    }]
};

Blockly.Lua['turtle_place'] = function(block) {
  // Generate Lua for placing forward, up, or down.
  var code = 'turtle.' + block.getTitleValue('DIR') + '(' +
      (Blockly.Lua.valueToCode(block, 'TEXT', Blockly.Lua.ORDER_NONE) || '') +
      ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_craft'] = {
  // Craft an item.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('LIMIT')
        .setCheck('Number')
        .appendTitle('craft')
        .permitsAll = true;
    this.setOutput(true, 'Boolean');
    this.setTooltip('Craft items using ingredients in the turtle\'s inventory when they\'re in a valid recipe pattern,\nplacing the result in the currently selected slot.  Returns true if items are crafted.\nIf no limit is provided, the turtle will make as many as possible (maximum 64).\nIf a limit of 0 is supplied, no items will be consumed,\nbut the return value will indicate whether a valid recipe is present.');
    this.setHelpUrl(BASE_TURTLE_HELP_URL_ + 'craft');
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_craft'] = function(block) {
  // Generate Lua for crafting an item.
  var argument0 = Blockly.Lua.valueToCode(block, 'LIMIT',
                                          Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.craft(' + argument0 + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_select'] = {
  // Select a slot.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('select slot #');
    this.setTooltip('Select the slot to use (1-16) for subsequent craft, drop, etc., commands.');
    this.setHelpUrl(BASE_TURTLE_HELP_URL_ + 'select');
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_select'] = function(block) {
  // Generate Lua for selecting a slot.
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE',
                                          Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.select(' + argument0 + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_compare'] = {
  // Block for comparing the specified block to the contents of the
  // selected slot.
  init: function() {
    var DIRECTIONS =
        [['compare front item to selected slot', 'compare'],
         ['compare above item to selected slot', 'compareUp'],
         ['compare below item to selected slot', 'compareDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip('Check if the block in the world is the same as the blocks\nin the selected slot of the turtle\'s inventory.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
};

Blockly.Lua['turtle_compare'] = function(block) {
  // Generate Lua for comparing the specified block to the contents of the
  // selected slot.
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return [code, Blockly.Lua.ORDER_HIGH];
};

Blockly.Blocks['turtle_get_item_count'] = {
  // Block for returning the number of items in the supplied slot.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('get item count in slot');
    this.setOutput(true, 'Number');
    this.setTooltip('Get the count of items in the supplied slot number.');
  }
};

Blockly.Lua['turtle_get_item_count'] = function(block) {
  // Generate Lua for getting the number of items in the supplied slot number
  var argument0 = Blockly.Lua.valueToCode(
    block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.getItemCount(' + argument0 + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_get_item_space'] = {
  // Block for getting the number of items that can be put in the numbered
  // slot.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('get free space in slot');
    this.setOutput(true, 'Number');
    this.setTooltip('Get the number of items that can be placed in the numbered slot.');
  }
};

Blockly.Lua['turtle_get_item_space'] = function(block) {
  // Generate Lua for getting the number of items that can be put in the
  // numbered slot.
  var argument0 = Blockly.Lua.valueToCode(
    block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.getItemSpace(' + argument0 + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_compare_to'] = {
  // Block for comparing items in the selected slot and the supplied one.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('compare item in selected slot to slot');
    this.setOutput(true, 'Boolean');
    this.setTooltip('Compares the currently selected slot and the specified slot,\nreturning true if they\'re the same, false if not.');
  }
};

Blockly.Lua['turtle_compare_to'] = function(block) {
  // Generate Lua for comparing items in the selected slot and the supplied one.
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE',
                                          Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.compareTo(' + argument0 + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_drop'] = {
  // Block for dropping items.
  init: function() {
    var DIRECTIONS =
        [['in front', 'drop'],
         ['up', 'dropUp'],
         ['down', 'dropDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('drop');
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .permitsAll = true;
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setInputsInline(true);
    this.setTooltip('Drops the supplied amount of items in the selected slot.\nIf an inventory such as a chest is on that side of the turtle,\nit will try to place into the inventory, returning false if the inventory is full.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_drop'] = function(block) {
  // Generate Lua for dropping items.
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.' + block.getTitleValue('DIR') + '(' + argument0 + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_suck'] = {
  // Block for getting the turtle to pick up or take items from the ground or
  // an inventory, respectively.
  init: function() {
    var DIRECTIONS =
        [['suck in front', 'suck'],
         ['suck up', 'suckUp'],
         ['suck down', 'suckDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip('Picks up an item stack of any size from the ground\nor an inventory (such as a chest) on that side\nand places in the selected slot.\nReturns true if the turtle can pick up an item.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_suck'] = function(block) {
  // Generate Lua for getting the turtle to pick up or take items from the
  // ground or an inventory, respectively.
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_refuel'] = {
  // Block for refuelling the turtle.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('refuel')
        .permitsAll = true;
    this.setOutput(true, 'Boolean');
    this.setTooltip('Refuels the turtle using a fuel item in the selected slot,\n returning whether it was successful.\nIf an input of 0 is supplied, no items will be consumed,\nbut the return value will indicate if the item can be used as fuel.');
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + 'refuel';
    });
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_refuel'] = function(block) {
  // Generate Lua for refuelling the turtle.
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.refuel(' + argument0 + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_get_fuel_level'] = {
  // Block for getting the turtle's fuel level
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('get fuel level');
    this.setOutput(true, 'Number');
    this.setTooltip('Returns the current fuel level of the turtle, which is the number of blocks the turtle can move.\nIf fuel is turned off in the ComputerCraft config this will return "unlimited".');
  }
};

Blockly.Lua['turtle_get_fuel_level'] = function(block) {
  // Generate Lua for getting the fuel level.
  var code = 'turtle.getFuelLevel()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_transfer_to'] = {
  // Block for transferring an item from the currently selected slot to the
  // specified slot.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('QUANTITY')
        .setCheck('Number')
        .appendTitle('move')
        .permitsAll = true;
    this.appendValueInput('SLOT')
        .setCheck('Number')
        .appendTitle('items from selected slot to slot');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setTooltip('Transfers items from the currently selected slot to the specified, returning whether it was successful.');
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_transfer_to'] = function(block) {
  // Generate Lua for transferring items from the selected slot to the
  // specified one.
  var argument0 = Blockly.Lua.valueToCode(
    block, 'SLOT', Blockly.Lua.ORDER_NONE) || '';
  var argument1 = Blockly.Lua.valueToCode(
    block, 'QUANTITY', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.transferTo(' + argument0 +
      (argument1 != '' ? ', ' + argument1 : '') + ')';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}

Blockly.Blocks['turtle_all'] =  {
  // Block to indicate that an operation should be applied to as many items as
  // possible.  The Turtle library omits the argument in this case.
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
