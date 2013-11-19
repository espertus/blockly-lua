/**
 * Blockly Lua: ComputerCraft
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

Blockly.ComputerCraft = {};

Blockly.ComputerCraft.BASE_HELP_URL = 'http://computercraft.info/wiki/';

Blockly.ComputerCraft.Block = function(prefix, colour, func) {
  this.prefix = prefix;
  this.colour = colour;
  this.func = func;
};

Blockly.ComputerCraft.HelpUrlType = {
  PREFIX_NAME: 1,  // Used by Block.
  PREFIX_DIR: 2    // Used by ExpStmtBlock.
};

Blockly.ComputerCraft.Block.prototype.init = function() {
  this.setColour(this.colour);
  this.setInputsInline(true);
  if (this.func.helpUrlType ==
      Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME) {
      this.helpUrl =
        Blockly.ComputerCraft.BASE_HELP_URL +
            this.prefix.charAt(0).toUpperCase() +
            this.prefix.slice(1) + '.' + this.func.name;
  }
  if (this.func.tooltip) {
    this.setTooltip(this.func.tooltip);
  }
  if (this.func.stmtConns) {
    this.setPreviousStatement(
      (this.func.stmtConns & Blockly.ComputerCraft.StmtConns.PREVIOUS) != 0);
    this.setNextStatement(
      (this.func.stmtConns & Blockly.ComputerCraft.StmtConns.NEXT) != 0);
  }
  if (this.func.output) {
    this.setOutput(true, this.func.output);
  }
  if (this.func.multipleOutputs) {
    this.multipleOutputs = this.func.multipleOutputs;
    this.setOutput(true);  // We don't specify types for multiple outputs.
  }
  // Subclass must set up inputs, including block title.
};

// This also uses func.directions.
Blockly.ComputerCraft.ExpStmtBlock = function(prefix, colour, func) {
  Blockly.ComputerCraft.Block.call(this, prefix, colour, func);
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.init = function() {
  Blockly.ComputerCraft.Block.prototype.init.call(this);
  if (this.func.directions) {
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(this.func.directions), 'DIR');
  }
  if (this.func.helpUrlType ==
      Blockly.ComputerCraft.HelpUrlType.PREFIX_DIR) {
    var thisBlock = this;
    this.setHelpUrl(function() {
      return Blockly.ComputerCraft.BASE_HELP_URL +
            thisBlock.prefix.charAt(0).toUpperCase() +
            thisBlock.prefix.slice(1) + '.' + thisBlock.getTitleValue('DIR');
    });
  }
  // Create Lua generator.
  if (!this.func.suppressLua) {
    var blockName = this.prefix + '_' + this.func.name;
    Blockly.Lua[blockName] = function(block) {
      if (block.func.directions) {
        var code = block.prefix + '.' + block.getTitleValue('DIR') + '()';
        return Blockly.ComputerCraft.ExpStmtBlock.prototype.adjustCode.call(
          block, code);
      }
      return null;
    };
  }
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.changeModes =
    function(shouldBeStatement) {
  this.unplug(true, true);
  if (shouldBeStatement) {
    this.setOutput(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.isStatement = true;
  } else {
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setOutput(true);
    this.isStatement = false;
  }
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.customContextMenu =
    function(options) {
  var option = {enabled: true};
  option.text = this.isStatement ? 'Add Output' : 'Remove Output';
  var thisBlock = this;
  option.callback = function() {
    thisBlock.changeModes(!thisBlock.isStatement);
  };
  options.push(option);
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.mutationToDom = function() {
  // Save whether it is a statement.
  var container = document.createElement('mutation');
  container.setAttribute('is_statement', this['isStatement'] || false);
  return container;
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.domToMutation
    = function(xmlElement) {
  this.changeModes(xmlElement.getAttribute('is_statement') == 'true');
};

Blockly.ComputerCraft.ExpStmtBlock.prototype.adjustCode = function(code) {
  if (this.isStatement) {
    return code + '\n';
  } else {
    return [code, Blockly.Lua.ORDER_HIGH];
  }
};

Blockly.ComputerCraft.StmtConns = {
  NONE: 0,
  PREVIOUS: 1,
  NEXT: 2
};


// ValueBlock is a block whose only inputs are value inputs (no dropdown
// menus, etc.).  It should be constructed with buildValueBlock(), below,
// which describes the parameters.

Blockly.ComputerCraft.ValueBlock = function(prefix, colour, func) {
  Blockly.ComputerCraft.Block.call(this, prefix, colour, func);
}

Blockly.ComputerCraft.ValueBlock.prototype.init = function() {
  Blockly.ComputerCraft.Block.prototype.init.call(this);
  // Build up arguments to the format expected by interpolateMsg.
  var interpArgs = []
  interpArgs.push(this.func.text);
  if (this.func.args) {
    for (var j = 0; j < this.func.args.length; j++) {
      var arg = [];
      arg.push(this.func.args[j][0]);  // name
      arg.push(this.func.args[j][1]);  // type
      arg.push(Blockly.ALIGN_RIGHT);
      interpArgs.push(arg);
    }
  }
  interpArgs.push(Blockly.ALIGN_RIGHT);
  Blockly.Block.prototype.interpolateMsg.apply(this, interpArgs);
}

/**
 * Create a block that has only value inputs (no dropdown menus, etc.).
 *
 * This creates Blockly.Blocks[NAME] and Blockly.Lua[NAME], where
 * NAME is func.prefix + '_' + func.name, as described below.
 *
 * @param {!string} prefix A lower-case prefix corresponding to a
 *     ComputerCraft API, such as "os".
 * @param {number} colour The block's colour.
 * @param {!Object} func An object with the following fields:
 *     - {string} name The name of the ComputerCraft function to be called,
 *         not including the prefix.
 *     - {?number} stmtConns The types of statement connections, if any.
 *         This should be the disjunction of Blockly.ComputerCraft.StmtConns
 *         values and may be omitted if there are no statement connections.
 *     - {?string} output The type of the output, if any.  Legal values are
 *         {'Boolean', 'Number', 'String', 'Table'}.  This should be omitted
 *         if the block does not have an output.
 *     - {?number} multipleOutputs The number of outputs, if greater than 1.
 *     - {string} text The block text, with %1 for the first value input,
 *         %2 for the second, etc.
 *     - {?Array.<Array.<string>>} args An array of two-element arrays, where
 *         the first element of each sub-array is an input name, and the
 *         second element is its type, from the set above.  This may be
 *         omitted or the empty list if there are no inputs.
 *     - {?string} tooltip The text for the tooltip.
 */
Blockly.ComputerCraft.buildValueBlock = function(prefix, colour, func) {
  var blockName = prefix + '_' + func.name;
  Blockly.Blocks[blockName] =
      new Blockly.ComputerCraft.ValueBlock(prefix, colour, func);
  Blockly.Lua[blockName] = function(block) {
    return Blockly.ComputerCraft.generateValueCode(
      block,
      func.output,
      prefix + '.' + func.name,
      func.args ? func.args.map(function(pair) {return pair[0];}) : []);
  };
};

Blockly.ComputerCraft.generateValueCode =
    function(block, expression, funcName, argNames) {
  var args = argNames.map(function(name) {
    return Blockly.Lua.valueToCode(block, name, Blockly.Lua.ORDER_NONE);
  });
  var code = funcName + '(' + args.join(', ') + ')';
  if (expression) {
    return [code, Blockly.Lua.ORDER_HIGH];
  } else {
    return code + '\n';
  }
};
