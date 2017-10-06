"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//cells have four states "dead" "alive" "newborn" and "newdead"
var cells = [];
var width = 50;
var height = 50;
//stores interval
var interval = null;

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board(props) {
    _classCallCheck(this, Board);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      running: false,
      cellsHTML: "",
      generationCount: 0
    };
    return _this;
  }

  //generates and populates board

  Board.prototype.componentDidMount = function componentDidMount() {
    this.generateCells();
    this.populateCells();
    this.takeGenerationalStep();
    this.toggleInterval();
  };

  Board.prototype.toggleInterval = function toggleInterval() {
    if (!this.state.running) {
      this.setState({
        running: true
      });
      interval = setInterval(this.takeGenerationalStep.bind(this), 500);
    } else {
      this.setState({
        running: false
      });
      clearInterval(interval);
    }
  };

  //populates the cells array with dead cell objects

  Board.prototype.generateCells = function generateCells() {
    var resultArr = [];
    cells = [];
    for (var i = 0; i < height; i++) {
      var rowArr = [];
      for (var j = 0; j < width; j++) {
        var newCell = {
          status: "dead",
          coordY: i,
          coordX: j
        };
        rowArr.push(newCell);
      }
      resultArr.push(rowArr);
    }
    cells = resultArr;
  };

  //populates cell array with live cells

  Board.prototype.populateCells = function populateCells() {
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var rand = Math.floor(Math.random() * 100);
        if (rand >= 70) {
          cells[i][j].status = "alive";
        }
      }
    }
  };

  //goes through cells array and moves it forward a generation

  Board.prototype.takeGenerationalStep = function takeGenerationalStep() {
    //turns all old newborn cells into "live" cells
    //turns all old newdead cells into "dead" cells
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        if (cells[i][j].status === "newborn") {
          cells[i][j].status = "alive";
        } else if (cells[i][j].status === "newdead") {
          cells[i][j].status = "dead";
        }
      }
    }

    /*calculates newborn and newdead cells*/
    //iterates through each cell
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var counter = 0;
        //iterates through a box around each cell
        for (var k = i - 1; k < height && k <= i + 1; k++) {
          for (var l = j - 1; l < width && l <= j + 1; l++) {
            if (l >= 0 && k >= 0 && (cells[k][l].status === "alive" || cells[k][l].status === "newdead")) {
              counter++;
              if (cells[i][j].status === "alive" && k === i && j === l) {
                counter--;
              }
            }
          }
        }
        if (counter === 3 && cells[i][j].status === "dead") {
          cells[i][j].status = "newborn";
        } else if ((counter > 3 && cells[i][j].status === "alive" || counter < 2) && cells[i][j].status === "alive") {
          cells[i][j].status = "newdead";
        }
      }
    }
    this.setState({
      generationCount: this.state.generationCount + 1
    });
    this.buildCells();
  };

  Board.prototype.buildCells = function buildCells() {
    var _this2 = this;

    var cellsHTML = cells.map(function (row) {
      return React.createElement(
        "div",
        { className: "row" },
        row.map(function (cell) {
          return React.createElement(Cell, {
            cell: cell,
            buildCells: _this2.buildCells.bind(_this2)
          });
        })
      );
    });
    this.setState({
      cellsHTML: cellsHTML
    });
  };

  Board.prototype.regenerate = function regenerate() {
    this.setState({
      generationCount: 0
    });
    this.generateCells();
    this.populateCells();
    this.buildCells();
  };

  Board.prototype.clear = function clear() {
    this.setState({
      generationCount: 0
    });
    this.generateCells();
    this.buildCells();
  };

  Board.prototype.render = function render() {
    return React.createElement(
      "div",
      { className: "boardWrapper" },
      React.createElement(
        "div",
        { className: "toolbar row" },
        React.createElement(
          "button",
          { className: "btn btn-secondary btn-sm", onClick: this.toggleInterval.bind(this) },
          this.state.running ? "Stop" : "Start"
        ),
        React.createElement(
          "button",
          { className: "btn btn-secondary btn-sm", onClick: this.regenerate.bind(this) },
          "Generate"
        ),
        React.createElement(
          "button",
          { className: "btn btn-secondary btn-sm", onClick: this.clear.bind(this) },
          "Clear"
        ),
        React.createElement(
          "div",
          { className: "generationCountDispWraperr" },
          React.createElement(
            "p",
            { className: "generationCountDisp" },
            "Generation: " + this.state.generationCount
          )
        )
      ),
      React.createElement(
        "div",
        { className: "board" },
        this.state.cellsHTML
      )
    );
  };

  return Board;
}(React.Component);

//TODO it appears to be returning the correct html idk what

var Cell = function (_React$Component2) {
  _inherits(Cell, _React$Component2);

  function Cell(props) {
    _classCallCheck(this, Cell);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this, props));

    _this3.state = {
      coordY: _this3.props.cell.coordY,
      coordX: _this3.props.cell.coordX
    };
    _this3.handleCellClick = _this3.handleCellClick.bind(_this3);
    return _this3;
  }

  Cell.prototype.getCellClasses = function getCellClasses() {
    var classes = this.props.cell.status + " cell";
    return classes;
  };

  Cell.prototype.handleCellClick = function handleCellClick() {
    if (cells[this.state.coordY][this.state.coordX].status === "dead" || cells[this.state.coordY][this.state.coordX] === "newdead") {
      cells[this.state.coordY][this.state.coordX].status = "newborn";
    } else if (cells[this.state.coordY][this.state.coordX].status === "alive" || cells[this.state.coordY][this.state.coordX].status === "newborn") {
      cells[this.state.coordY][this.state.coordX].status = "newdead";
    }
    console.log("click");
    this.props.buildCells();
  };

  Cell.prototype.render = function render() {
    return React.createElement("div", { className: this.getCellClasses(), onClick: this.handleCellClick });
  };

  return Cell;
}(React.Component);

ReactDOM.render(React.createElement(Board, null), document.getElementById("root"));