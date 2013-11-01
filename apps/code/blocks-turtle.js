BASE_TURTLE_HELP_URL_ = BlocklyLua.BASE_HELP_URL + 'Turtle.';

Blockly.Blocks['turtle_move'] = {
  // Block for moving forward, back, up, or down.
  init: function() {
    var DIRECTIONS =
        [[BlocklyApps.getMsg('Code_turtleForward'), 'forward'],
         [BlocklyApps.getMsg('Code_turtleBackward'), 'back'],
         [BlocklyApps.getMsg('Code_turtleUp'), 'up'],
         [BlocklyApps.getMsg('Code_turtleDown'), 'down']];
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip(BlocklyApps.getMsg('Code_turtleMoveTooltip'));
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
        [[BlocklyApps.getMsg('Code_turtleRight'), 'turnRight'],
         [BlocklyApps.getMsg('Code_turtleLeft'), 'turnLeft']];
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('code_turtleTurnTooltip'));
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
        [[BlocklyApps.getMsg('Code_turtleDigFront'), 'dig'],
         [BlocklyApps.getMsg('Code_turtleDigUp'), 'digUp'],
         [BlocklyApps.getMsg('Code_turtleDigDown'), 'digDown']];
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean');
    this.setTooltip(BlocklyApps.getMsg('Code_turtleDigTooltip'));
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
        [[BlocklyApps.getMsg('Code_turtleDetectFront'), 'detect'],
         [BlocklyApps.getMsg('Code_turtleDetectUp'), 'detectUp'],
         [BlocklyApps.getMsg('Code_turtleDetectDown'), 'detectDown']];
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip(BlocklyApps.getMsg('Code_turtleDetectTooltip'));
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
        [[BlocklyApps.getMsg('Code_turtlePlaceFront'), 'place'],
         [BlocklyApps.getMsg('Code_turtlePlaceUp'), 'placeUp'],
         [BlocklyApps.getMsg('Code_turtlePlaceDown'), 'placeDown']];
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setOutput(true, 'Boolean')
    this.setTooltip(BlocklyApps.getMsg('Code_turtlePlaceTooltip'));
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
        [[BlocklyApps.getMsg('Code_turtlePlaceSignFront'), 'place'],
         [BlocklyApps.getMsg('Code_turtlePlaceSignUp'), 'placeUp'],
         [BlocklyApps.getMsg('Code_turtlePlaceSignDown'), 'placeDown']];
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.interpolateMsg(BlocklyApps.getMsg('Code_turtlePlaceSignText'),
                        ['TEXT', 'String', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setOutput(true, 'Boolean')
    this.setTooltip(BlocklyApps.getMsg('Code_turtlePlaceTooltip'));
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
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Code_craft'));
    this.appendValueInput('LIMIT')
        .setCheck('Number')
        .appendTitle(BlocklyApps.getMsg('Code_craftLimit'));
    this.setTooltip(BlocklyApps.getMsg('Code_craftTooltip'));
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
    this.setColour(160);
    this.interpolateMsg(BlocklyApps.getMsg('Code_select'),
                        ['VALUE', 'Number', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setTooltip(BlocklyApps.getMsg('Code_selectTooltip'));
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
    this.setColour(160);
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
