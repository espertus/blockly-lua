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
    this.setTooltip('Try to move the turtle in the specified direction, ' +
        'returning true if successful, false if the way is blocked.');
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
    this.isStatement = false;
    var thisBlock = this;
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
    this.setTooltip('Try to dig in the specified direction, returning true if successful, false otherwise (for example, if the block is empty or bedrock is encountered).');
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
    this.setTooltip('Detect whether there is a block in the specified direction.  Mobs, liquids, and floating objects are not detected.  The result is true if a block was detected, false otherwise.');
    var thisBlock = this;
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
    var DIRECTIONS =
        [['place item in front', 'place'],
         ['place item up', 'placeUp'],
         ['place item below', 'placeDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip('Place an item from the selected slot in the specified direction.  The result is true if successful, false if no item was in the slot or it could not be placed.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_place'] = function(block) {
  // Generate Lua for placing forward, up, or down.
  var code = 'turtle.' + block.getTitleValue('DIR') + '()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_place_sign'] = {
  // Block for placing a sign from the selected slot in front of, above,
  // or below the turtle.
  init: function() {
    var DIRECTIONS =
        [['place sign in front with text', 'place'],
         ['place sign up with text', 'placeUp'],
         ['place sign down with text', 'placeDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip('Place an item from the selected slot in the specified direction.  If it is a sign, it will have the specified text.  The result is true if an item could be placed, false if no item was in the slot or it could not be placed.');
    var thisBlock = this;
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + thisBlock.getTitleValue('DIR');
    });
  },
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_place_sign'] = function(block) {
  // Generate Lua for placing forward, up, or down.
  var text = Blockly.Lua.valueToCode(block, 'TEXT',
      Blockly.Lua.ORDER_NONE) || '0';
  var code = 'turtle.' + block.getTitleValue('DIR') + '(' + text +')'
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
};

Blockly.Blocks['turtle_craft'] = {
  // Craft an item.
  init: function() {
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('LIMIT')
        .setCheck('Number')
        .appendTitle('craft with limit');
    this.setTooltip('Craft items using ingredient in the turtle\'s inventory, putting results in the currently selected slot.  If no limit is provided, the turtle will make as many as possible.');
    this.setHelpUrl(BASE_TURTLE_HELP_URL_ + 'craft');
    this.isStatement = false;
    var thisBlock = this;
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['turtle_craft'] = function(block) {
  // Generate Lua for crafting an item.  A limit argument is optional.
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
    this.isStatement = false;
    var thisBlock = this;
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
        [['compare front block to selected slot', 'compare'],
         ['compare above block to selected slot', 'compareUp'],
         ['compare below block to selected slot', 'compareDown']];
    this.setColour(TURTLE_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip('Check if the specified block is the same as the blocks ' +
        'in the selected slot of the turtle\'s inventory.');
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
