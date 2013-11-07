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
  return 'error(' + message + ', 0)\n';
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

Blockly.Blocks['os_get_computer_id'] = {
  // Block for getting the id of this computer
  init: function() {
    this.setColour(OS_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('computer ID');
    this.setOutput(true, 'Number');
    this.setTooltip('Returns the unique ID of this computer.');
    this.setHelpUrl(BASE_OS_HELP_URL_ + 'getComputerID');
  }
}

Blockly.Lua['os_get_computer_id'] = function(block) {
  // Generate Lua for getting the id of this computer
  return 'os.getComputerID()\n';
}

Blockly.Blocks['os_get_computer_label'] = {
  // Block for getting the label of this computer
  init: function() {
    this.setColour(OS_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('get computer label');
    this.setOutput(true, 'Number');
    this.setTooltip('Returns the label of this computer.');
    this.setHelpUrl(BASE_OS_HELP_URL_ + 'getComputerLabel');
  }
}

Blockly.Lua['os_get_computer_label'] = function(block) {
  // Generate Lua for getting the label of this computer
  return 'os.getComputerLabel()\n';
}

Blockly.Blocks['os_set_computer_label'] = {
  // Block for setting the label of this computer
  init: function() {
    this.setColour(OS_BLOCK_COLOUR_);
    this.setValueInput('LABEL')
        .setCheck('String')
        .appendTitle('set computer label');
    this.setTooltip('Sets the label of this computer.');
    this.setHelpUrl(BASE_OS_HELP_URL_ + 'setComputerLabel');
  }
}

Blockly.Lua['os_set_computer_label'] = function(block) {
  // Generate Lua for setting the label of this computer
  var argument0 = Blockly.Lua.valueToCode(block, 'LABEL', Blockly.Lua.ORDER_NONE) || '';
  return 'os.setComputerLabel(' + argument0 + ')\n';
}

Blockly.Blocks['os_reboot'] = {
  // Block for rebooting the computer
  init: function() {
    this.setColour(OS_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('restart computer');
    this.setTooltip('Restarts the computer.');
    this.setHelpUrl(BASE_OS_HELP_URL_ + 'reboot');
  }
}

Blockly.Lua['os_reboot'] = function(block) {
  // Generate Lua for rebooting the computer
  return 'os.reboot()\n';
}

Blockly.Blocks['os_shutdown'] = {
  // Block for shutting down the computer
  init: function() {
    this.setColour(OS_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('turn off computer');
    this.setTooltip('Turns off the computer.');
    this.setHelpUrl(BASE_OS_HELP_URL_ + 'shutdown');
  }
}

Blockly.Lua['os_shutdown'] = function(block) {
  // Generate Lua for shutting down the computer
  return 'os.shutdown()\n';
}