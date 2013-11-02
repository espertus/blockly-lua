var BASE_OS_HELP_URL_ = BlocklyLua.BASE_HELP_URL + 'Os.';
OS_BLOCK_COLOUR_ = 30;

Blockly.Blocks['os_terminate'] = {
  // Terminate program with error message.
  init: function() {
    this.setColour(OS_BLOCK_COLOUR_);
    this.appendValueInput('MSG')
        .appendTitle('terminate with error ');
    this.setTooltip('End the program with the provided error message.  ' +
        'This should not be used for normal termination.');
    // This has a previous, but not a following, statement.
    this.setPreviousStatement(true);
  }
};

Blockly.Lua['os_terminate'] = function(block) {
  // Generate Lua for terminating program with error message.
  var message = Blockly.Lua.valueToCode(block, 'MSG',
      Blockly.Lua.ORDER_NONE) || '"error"';
  return 'error(' + message + ')\n';
};

// Added in order to continue to support programs with the old block name.
Blockly.Blocks['terminate'] = Blockly.Blocks['os_terminate'];
Blockly.Lua['terminate'] = Blockly.Lua['os_terminate'];

Blockly.Blocks['os_sleep'] = {
  // Sleep for the specified number of seconds.
  init: function() {
    this.setColour(OS_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('sleep');
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('seconds');
    this.setTooltip('Sleep for the specified number of seconds.')
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setHelpUrl(BASE_OS_HELP_URL_ + 'sleep');
  }
};

Blockly.Lua['os_sleep'] = function(block) {
  // Generate Lua for sleeping the specified number of seconds.
  var argument0 = Blockly.Lua.valueToCode(block, 'VALUE',
      Blockly.Lua.ORDER_NONE) || '1';
  return 'sleep(' + argument0 + ')\n';
};
