/**
 * Blockly Lua: ComputerCraft Terminal (term) API
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
 * @fileoverview Blocks for ComputerCraft Terminal (term) API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft.TERM_BLOCK_COLOUR_ = 160;

Blockly.ComputerCraft.TERM_FUNCS_ = [
  {funcName: 'write',
   text: 'write %1 to screen',
   args: [['Text', 'String']],
   tooltip:
   'Write the given string to the screen (terminal or monitor).'
  },
  {funcName: 'clear',
   text: 'clear screen',
   tooltip: 'Clear the entire screen (terminal or monitor).'
  },
  {funcName: 'clearLine',
   text: 'clear line on screen',
   tooltip: 'Clear the line the cursor is on.'
  },
  {funcName: 'getCursorPos',
   text: 'get cursor position',
   output: 'Number',  // first output
   tooltip: 'Get the x and y coodinates of the cursor.',
   multipleOutputs: 2
  },
  {funcName: 'setCursorPos',
   text: 'set cursor position to (%1, %2)',
   args: [['X', 'Number'], ['Y', 'Number']],
   tooltip: 'Set the x and y coodinates, respecitvely, of the cursor.'
  },
  {funcName: 'isColor',
   text: 'computer supports colour?',
   output: 'Boolean',
   tooltip:
   'Return true if the computer supports colour, false otherwise.\n' +
   'This indicates whether an Advanced Computer is being used.'
  },
  {funcName: 'getSize',
   text: 'get width and height of screen',
   output: 'Number',  // first output
   multipleOutputs: 2,
   tooltip:
   'Get the maximum x-coordinate (width) and y-coordinate (height)\n' +
   'of the screen (terminal or monitor)'
  },
  {funcName: 'scroll',
   text: 'scroll the screen %1 line(s)',
   args: [['NUM', 'Number']],
   tooltip:
   'Scroll the screen (terminal or monitor)\n' +
   'the specified number of lines.'
  },
  {funcName: 'redirect',
   text: 'redirect display to %1',
   args: [['TERM', 'Peripheral']],
   tooltip:
   'Redirect terminal output to a monitor or other redirect target.\n' +
   'The input is usually the output of "wrap peripheral"\n' +
   'Display can be restored to the original with the "restore display" block.'
  },
  {funcName: 'restore',
   text: 'restore display',
   tooltip:
   'Restore the display to the previous target, \n' +
   'after changing it with the "redirect display" block.'
  },
  {funcName: 'setTextColor',
   text: 'set text colour to %1',
   args: [['COLOUR', ['Colour', 'Number']]],
   tooltip:
   'Set the text colour of the terminal.\n' +
   'This is only available for Advanced Computers\n' +
   'and Advanced Monitors.'
  },
  {funcName: 'setBackgroundColor',
   text: 'set background colour to %1',
   args: [['COLOUR', ['Colour', 'Number']]],
   tooltip:
   'Set the background colour of the screen.\n' +
   'This is only available for Advanced Computers\n' +
   'and Advanced Monitors.'
  },
  {funcName: 'setTextScale',
   text: 'scale text by %1',
   args: [['SCALE', 'Number']],
   tooltip:
   'Set the size of all text on the connected monitor.\n' +
   'The input must be a multiple of .5 between .5 and 5 (inclusive).\n' +
   'This is only available on monitors, not terminals.'
  }
];

for (var i = 0; i < Blockly.ComputerCraft.TERM_FUNCS_.length; i++) {
  Blockly.ComputerCraft.buildValueBlock(
    'term',
    Blockly.ComputerCraft.TERM_BLOCK_COLOUR_,
    Blockly.ComputerCraft.TERM_FUNCS_[i]);
}

Blockly.Blocks['term_set_text_scale'].onchange = function() {
  if (!this.workspace) {
    // Block has been deleted.
    return;
  }
  // If there's no child block, no warning.
  if (!this.childBlocks_) {
    this.setWarningText(null);
    return;
  }
  // Don't display (or remove) a warning if the child
  // block is selected, since editing might be in progress.
  // Flaw: No warning is displayed if after typing (but not entering)
  // a bad value, user clicks on 'Lua'.
  if (Blockly.selected == this.childBlocks_[0]) {
    return;
  }
  // If the input is a constant, make sure it is divisible by .5
  // and in the range [.5, 5].
  var code = Blockly.Lua.valueToCode(this, 'SCALE', Blockly.Lua.ORDER_NONE);
  if (code) {
    var num = Number(code);
    if (num != NaN) {
      if (num * 2 != Math.floor(num * 2) || num < .5 || num > 5) {
        this.setWarningText(
          'The scale value must be a multiple of .5 in the range .5 to 5.');
        return;
      }
    }
  }
  this.setWarningText(null);
};

Blockly.Blocks['term_set_cursor_blink'] = new Blockly.ComputerCraft.Block(
  'term', Blockly.ComputerCraft.TERM_BLOCK_COLOUR_, {
    funcName: 'setCursorBlink',
    helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME,
    tooltip:
    'Enable or disable blinking of the\n' +
    'cursor on a screen (terminal or monitor).'});

Blockly.Blocks['term_set_cursor_blink'].init = function() {
  Blockly.ComputerCraft.Block.prototype.init.call(this);
  this.appendDummyInput()
      .appendTitle(
        new Blockly.FieldDropdown(
          [['turn on cursor blinking', 'true'],
           ['turn off cursor blinking', 'false']]),
        'STATUS')
};

Blockly.Lua['term_set_cursor_blink'] = Blockly.ComputerCraft.generateLuaInner_;
