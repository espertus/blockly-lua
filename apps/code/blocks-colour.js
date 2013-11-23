/**
 * Blockly Lua: ComputerCraft Colour API
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
 * @fileoverview Colour blocks for ComputerCraft.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */

/**
 * An array of colours for the palette.  The rgb attributes may be tweaked,
 * but the value attributes must not, since they correspond to ones on
 * "http://computercraft.info/wiki/Colors_%28API%29".
 */
var COLOURS_ = [
  // WHITE
  { rgb: '#f0f0f0', value: 1 << 0 },
  // ORANGE
  { rgb: '#f2b233', value: 1 << 1 },
  // MAGENTA
  { rgb: '#e57fd8', value: 1 << 2 },
  // LIGHT_BLUE
  { rgb: '#99b2f2', value: 1 << 3 },
  // YELLOW
  { rgb: '#dede6c', value: 1 << 4 },
  // LIME
  { rgb: '#7fcc19', value: 1 << 5 },
  // PINK
  { rgb: '#f2b2cc', value: 1 << 6 },
  // GREY
  { rgb: '#4c4c4c', value: 1 << 7 },
  // LIGHT_GREY
  { rgb: '#999999', value: 1 << 8 },
  // CYAN
  { rgb: '#4c99b2', value: 1 << 9 },
  // PURPLE
  { rgb: '#b266e5', value: 1 << 10 },
  // BLUE
  { rgb: '#253192', value: 1 << 11 },
  // BROWN
  { rgb: '#7f664c', value: 1 << 12 },
  // GREEN
  { rgb: '#57a64e', value: 1 << 13 },
  // RED
  { rgb: '#cc4c4c', value: 1 << 14 },
  // BLACK
  { rgb: '#191919', value: 1 << 15 }
];

/**
 * The order in which colours should appear on the palette.
 * Array.prototype.map is supported by IE 9+ and all other major browsers.
 * This overrides a value defined in core/field_colour.js
 * (via blockly_[un]compressed.js).
 */
Blockly.FieldColour.COLOURS = COLOURS_.map(function(c) {return c.rgb;});

/**
 * Number of columns in the palette.
 * This overrides a value defined in core/field_colour.js
 * (via blockly_[un]compressed.js).
 */
Blockly.FieldColour.COLUMNS = 4;

Blockly.Blocks['colour_picker'] = {
  // Colour picker.
  init: function() {
    this.setHelpUrl('http://computercraft.info/wiki/Colors_%28API%29');
    this.setColour(20);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldColour('#cc4c4c'), 'COLOUR');
    this.setOutput(true, 'Colour');
    this.setTooltip(
      'Choose among colours (from left to right, top to bottom):\n' +
      'white, orange, magenta, light blue,\n' +
      'yellow, lime, pink, grey,\n' +
      'light gray, cyan purple, blue,\n' +
      'brown, green, red, black.');
  }
};

Blockly.Lua['colour_picker'] = function(block) {
  // Generate Lua code for the selected ComputerCraft colour.
  var colour = block.inputList[0].titleRow[0].colour_;
  for (var i = 0; i < COLOURS_.length; i++) {
    var entry = COLOURS_[i];
    if (entry.rgb == colour) {
      return [entry.value, Blockly.Lua.ORDER_NONE];
    }
  }
  // This line shouldn't be reached.
  window.alert('Error from colour_picker.');
};
