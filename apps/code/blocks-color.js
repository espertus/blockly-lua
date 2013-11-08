var BASE_COLOUR_HELP_URL_ = BlocklyLua.BASE_HELP_URL + 'Colors.';
COLOUR_BLOCK_COLOUR_ = 376;

Blockly.Blocks['color_value'] = {
  // Block to supply colour values
  init: function() {
    var COLOURS =
        [['color black', 'black'],
         ['color blue', 'blue'],
         ['color light blue', 'lightBlue'],
         ['color brown', 'brown'],
         ['color cyan', 'cyan'],
         ['color gray', 'gray'],
         ['color light gray', 'lightGray'],
         ['color green', 'green'],
         ['color lime', 'lime'],
         ['color magenta', 'magenta'],
         ['color orange', 'orange'],
         ['color pink', 'pink'],
         ['color purple', 'purple'],
         ['color red', 'red'],
         ['color white', 'white'],
         ['color yellow', 'yellow']];
    this.setColour(COLOUR_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(COLOURS), 'COLOR');
    this.setOutput(true, 'Number');
    this.setTooltip('A ComputerCraft color');
    this.setHelpUrl(function() {
      return BASE_TURTLE_HELP_URL_ + 'Colors_(API)#Colors';
    });
  },
  // Enable block to change between statement and expression.
  changeModes: BlocklyLua.HELPER_FUNCTIONS['changeModes'],
  customContextMenu: BlocklyLua.HELPER_FUNCTIONS['customContextMenu'],
  mutationToDom: BlocklyLua.HELPER_FUNCTIONS['mutationToDom'],
  domToMutation: BlocklyLua.HELPER_FUNCTIONS['domToMutation']
};

Blockly.Lua['color_value'] = function(block) {
  // Generate Lua to supply colour values
  return 'colors.' + block.getTitleValue('COLOR') + '\n';
};