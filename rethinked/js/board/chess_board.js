//Rethinked chess
//Cleaner code => Happy ME

//
//Easy usage for html sites
//In case you want to insert it to a html page create two divs in the page with custom ids and give the ids below when asked
//Than call the main function in the body of the page
//!!!
//IMPORTANT-> Call the main() before the divs are created (On body onload) else it will not initialize the game
//!!!
//
//!!!!!
//The canvases are generated dynamically into the given html divs:
//Id of the container div:
const container_div_id = "chess_container";
//Id of the control panel div:
const cpanel_div_id = "chess_control_panel";

//The following function initialises the canvases with the needed css formats and appends it to the container div
//Positions are important because the canvases are layered
function get_canvases() {
    let board_canvas = document.createElement("CANVAS");
    let game_canvas = document.createElement("CANVAS");
    board_canvas.classList.add("chess");
    game_canvas.classList.add("chess");
    board_canvas.setAttribute("id", board_canvas_id);
    board_canvas.setAttribute("width", "420");
    board_canvas.setAttribute("height", "420");
    game_canvas.setAttribute("id", game_canvas_id);
    game_canvas.setAttribute("width", "420");
    game_canvas.setAttribute("height", "420");
    board_canvas.style.cssText = game_canvas.style.cssText =
        "z-index: 0;" +
        "position: fixed;" +
        "top: 180px;" +
        "left: 100px;" +
        "margin: 0;" +
        "padding: 0;";
    let container_div = document.getElementById(container_div_id);
    container_div.appendChild(board_canvas);
    container_div.appendChild(game_canvas);
}

//Creates the control panel for the game
function create_control_panel() {
    let p1_label = document.createElement("label");
    let p2_label = document.createElement("label");
    let p1_input = document.createElement("input");
    let p2_input = document.createElement("input");
    let start_button = document.createElement("button");
    let back_button = document.createElement("button");
    let player1 = document.createElement("p");
    let player2 = document.createElement("p");
    let cpanel_div = document.getElementById(cpanel_div_id);

    p1_label.setAttribute("for", "player1");
    p2_label.setAttribute("for", "player2");

    p1_input.setAttribute("type", "text");
    p1_input.setAttribute("id", "player1");
    p1_input.setAttribute("placeholder", "Ready player one?");
    p2_input.setAttribute("type", "text");
    p2_input.setAttribute("id", "player2");
    p2_input.setAttribute("placeholder", "Ready player two?");

    p1_input.style.cssText = p2_input.style.cssText = "margin: 3px;";

    start_button.innerText = "Start game";
    back_button.innerText = "Back";
    start_button.setAttribute("id", "start_button");
    back_button.setAttribute("id", "back_button");
    start_button.style.cssText = back_button.style.cssText = "width: 166px; height: 42px; padding: 3px; margin: 3px; margin-top: 10px;";

    player1.innerText = "Player one: ";
    player2.innerText = "Player two: ";
    player1.style.cssText = player2.style.cssText = "display: inline-block; margin: 3px; padding: 3px;";

    cpanel_div.appendChild(player1);
    cpanel_div.appendChild(p1_label);
    cpanel_div.appendChild(p1_input);
    cpanel_div.appendChild(document.createElement("br"));
    cpanel_div.appendChild(player2);
    cpanel_div.appendChild(p2_label);
    cpanel_div.appendChild(p2_input);
    cpanel_div.appendChild(document.createElement("br"));
    cpanel_div.appendChild(start_button);
    cpanel_div.appendChild(back_button);

}


//You need two html canvas with the following ids:
//Change names to personalize
const game_canvas_id = "pieces";
const board_canvas_id = "board";


//The source of the pieces image
const piece_img_src = "../img/pieces.png";

//The size of a piece image in the pieces picture
//Default = 100
//Possible change if using other piece picture
const PIECE_IMAGE_SIZE = 100;

//Piece codes
//DO NOT CHANGE!
const PAWN = 0,
    ROOK = 1,
    KNIGHT = 2,
    BISHOP = 3,
    QUEEN = 4,
    KING = 5;

//Need two global variables for good working code (selected_piece = null, black_turn = false;)
let selected_piece = null
let black_turn = false;


class Chess_board {
    constructor() {
        this._game_canvas = document.getElementById(game_canvas_id);  //The game canvas, where the pieces are displayed
        this._board_canvas = document.getElementById(board_canvas_id);  //Where the board is displayed
        this._game_ctx = this._game_canvas.getContext("2d");    //Contexts
        this._board_ctx = this._board_canvas.getContext("2d");
        this._canvas_size = this._game_canvas.width;                    //The size of the canvas (width = height)
        this._cell_size = this._canvas_size / 8;                        //The size of a cell
        //Change colors to customize the board
        this._color1 = `#51361a`;
        this._color2 = `#dd7f2a`;
        this._hightlight_color1 = `#00ff00`;
        this._hightlight_color2 = `#ff0000`;
        this._text_color = '#40e0f0';
        //Pieces image
        this._pieces_img = new Image();
        //Pieces image source
        this._pieces_img.src = piece_img_src;
        //Stores the whole game step by step
        this._full_game = [];

        //Piece classes
        //Parent class:
        //Class that represents a piece
        //Has a name, position, black or white, code and status ('active'/'inactive')
        this.Piece = class Piece {
                constructor(name, col, row, black, status = "active") {
                    if (typeof (name) !== "string" || typeof (col) !== "number" || typeof (row) !== "number" || typeof (black) !== "boolean") {
                        throw TypeError("[!] Invalid argument(s) for Piece constructor!");
                    }
                    this._name = name;
                    this.x = col;
                    this.y = row;
                    this._black = black;
                    this.status = status;
                    switch (name) {
                        case "pawn":
                            this._code = PAWN;
                            break;
                        case "rook":
                            this._code = ROOK;
                            break;
                        case "knight":
                            this._code = KNIGHT;
                            break;
                        case "bishop":
                            this._code = BISHOP;
                            break;
                        case "king":
                            this._code = KING;
                            break;
                        case "queen":
                            this._code = QUEEN;
                            break;
                        default:
                            this._code = -1;
                    }
                }

                get name() {
                    return this._name;
                }

                get black() {
                    return this._black;
                }

                get piece_code() {
                    return this._code;
                }

                get x_pos() {
                    return this.x;
                }

                get y_pos() {
                    return this.y;
                }

                set x_pos(x) {
                    if (0 <= x < 8) {
                        this.x = x;
                    } else {
                        alert("Invalid coordinate!");
                    }
                }

                set y_pos(y) {
                    if (0 <= y < 8) {
                        this.y = y;
                    } else {
                        alert("Invalid coordinate!");
                    }
                }

                to_string() {
                    return `${(this.black ? "Black" : "White")} ${this.name} piece at:\n\tx -> ${this.x_pos}\n\ty -> ${this.y_pos}\n
                    `;
                }

            }
        //Each class has it's own get_moves() -> returns all moves for the piece like it's the only one on the board
        //Pawn piece class !!At validation need to filter steps for invalid kicking
        this.Pawn = class Pawn extends this.Piece {
            constructor(x, y, black) {
                super("pawn", x, y, black);
            }

            get_moves(board) {
                let x = this.x_pos;
                let y = this.y_pos;

                let moves = [];

                if (y === 6) {
                    for (let i = 1; i < 3; i++) {
                        if (Chess_board._check_piece_on_cell(x, y - i, board) == null) {
                            moves.push({X: x, Y: y - i});
                        } else {
                            break;
                        }
                    }
                } else {
                    if (Chess_board._check_piece_on_cell(x, y - 1, board) == null) {
                        moves.push({X: x, Y: y - 1});
                    }
                }
                if (Chess_board._check_piece_on_cell(x + 1, y - 1, board) != null &&
                    Chess_board._check_piece_on_cell(x + 1, y - 1, board).black !== black_turn) {
                    moves.push({X: x + 1, Y: y - 1});
                }
                if (Chess_board._check_piece_on_cell(x - 1, y - 1, board) != null &&
                    Chess_board._check_piece_on_cell(x - 1, y - 1, board).black !== black_turn) {
                    moves.push({X: x - 1, Y: y - 1});
                }
                return moves;
            }
        }
        this.Rook = class Rook extends this.Piece {
            constructor(x, y, black) {
                super("rook", x, y, black);
            }

            get_moves(board) {
                let x = this.x_pos;
                let y = this.y_pos;
                let moves = [];
                for (let i = 1; i < 8; i++) {
                    if (x + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x + i, y, board);
                    if (piece == null) {
                        moves.push({X: x + i, Y: y});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x + i, Y: y});
                        break;
                    } else {
                        break;
                    }
                }
                for (let i = 1; i < 8; i++) {
                    if (x - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x - i, y, board);
                    if (piece == null) {
                        moves.push({X: x - i, Y: y});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x - i, Y: y});
                        break;
                    } else {
                        break;
                    }
                }
                for (let i = 1; i < 8; i++) {
                    if (y + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x, y + i, board);
                    if (piece == null) {
                        moves.push({X: x, Y: y + i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x, Y: y + i});
                        break;
                    } else {
                        break;
                    }
                }
                for (let i = 1; i < 8; i++) {
                    if (y - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x, y - i, board);
                    if (piece == null) {
                        moves.push({X: x, Y: y - i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x, Y: y - i});
                        break;
                    } else {
                        break;
                    }
                }
                return moves;
            }
        }
        this.Knight = class Knight extends this.Piece {
            constructor(x, y, black) {
                super("knight", x, y, black);
            }

            get_moves(board) {
                let x = this.x_pos;
                let y = this.y_pos;
                const where_to_check = [
                    {X: x + 1, Y: y - 2},
                    {X: x + 2, Y: y - 1},
                    {X: x + 2, Y: y + 1},
                    {X: x + 1, Y: y + 2},
                    {X: x - 1, Y: y + 2},
                    {X: x - 2, Y: y + 1},
                    {X: x - 2, Y: y - 1},
                    {X: x - 1, Y: y - 2}
                ];
                let moves = [];
                for (let cp of where_to_check) {
                    if (cp.X > 7 || cp.X < 0 || cp.Y > 7 || cp.Y < 0) {
                        continue;
                    }
                    if (Chess_board._check_piece_on_cell(cp.X, cp.Y, board) == null) {
                        moves.push(cp);
                    } else if (Chess_board._check_piece_on_cell(cp.X, cp.Y, board).black !== black_turn) {
                        moves.push(cp);
                    }
                }
                return moves;
            }
        }
        this.Bishop = class Bishop extends this.Piece {
            constructor(x, y, black) {
                super("bishop", x, y, black);
            }

            get_moves(board) {
                let x = this.x_pos;
                let y = this.y_pos;
                let moves = [];

                //x+ y- -> right-up movement
                for (let i = 1; i < 8; i++) {
                    if (x === 7 || y === 0 || x + i > 7 || y - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x + i, y - i, board);
                    if (piece == null) {
                        moves.push({X: x + i, Y: y - i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x + i, Y: y - i});
                        break;
                    } else {
                        break;
                    }
                }

                //x+ y+ -> right-down movement
                for (let i = 1; i < 8; i++) {
                    if (x === 7 || y === 7 || x + i > 7 || y + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x + i, y + i, board);
                    if (piece == null) {
                        moves.push({X: x + i, Y: y + i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x + i, Y: y + i});
                        break;
                    } else {
                        break;
                    }
                }

                //x- y+ -> left-down movement
                for (let i = 1; i < 8; i++) {
                    if (x === 0 || y === 7 || x - i < 0 || y + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x - i, y + i, board);
                    if (piece == null) {
                        moves.push({X: x - i, Y: y + i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x - i, Y: y + i});
                        break;
                    } else {
                        break;
                    }
                }

                //x- y- -> left-up movement
                for (let i = 1; i < 8; i++) {
                    if (x === 0 || y === 0 || x - i < 0 || y - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x - i, y - i, board);
                    if (piece == null) {
                        moves.push({X: x - i, Y: y - i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x - i, Y: y - i});
                        break;
                    } else {
                        break;
                    }
                }

                return moves;
            }
        }
        this.Queen = class Queen extends this.Piece {
            constructor(x, y, black) {
                super("queen", x, y, black);
            }

            get_moves(board) {
                let x = this.x_pos;
                let y = this.y_pos;

                //Diagonal moves:
                let moves = [];

                //x+ y- -> right-up movement
                for (let i = 1; i < 8; i++) {
                    if (x === 7 || y === 0 || x + i > 7 || y - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x + i, y - i, board);
                    if (piece == null) {
                        moves.push({X: x + i, Y: y - i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x + i, Y: y - i});
                        break;
                    } else {
                        break;
                    }
                }

                //x+ y+ -> right-down movement
                for (let i = 1; i < 8; i++) {
                    if (x === 7 || y === 7 || x + i > 7 || y + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x + i, y + i, board);
                    if (piece == null) {
                        moves.push({X: x + i, Y: y + i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x + i, Y: y + i});
                        break;
                    } else {
                        break;
                    }
                }

                //x- y+ -> left-down movement
                for (let i = 1; i < 8; i++) {
                    if (x === 0 || y === 7 || x - i < 0 || y + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x - i, y + i, board);
                    if (piece == null) {
                        moves.push({X: x - i, Y: y + i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x - i, Y: y + i});
                        break;
                    } else {
                        break;
                    }
                }

                //x- y- -> left-up movement
                for (let i = 1; i < 8; i++) {
                    if (x === 0 || y === 0 || x - i < 0 || y - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x - i, y - i, board);
                    if (piece == null) {
                        moves.push({X: x - i, Y: y - i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x - i, Y: y - i});
                        break;
                    } else {
                        break;
                    }
                }

                //Straight moves:
                for (let i = 1; i < 8; i++) {
                    if (x + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x + i, y, board);
                    if (piece == null) {
                        moves.push({X: x + i, Y: y});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x + i, Y: y});
                        break;
                    } else {
                        break;
                    }
                }
                for (let i = 1; i < 8; i++) {
                    if (x - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x - i, y, board);
                    if (piece == null) {
                        moves.push({X: x - i, Y: y});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x - i, Y: y});
                        break;
                    } else {
                        break;
                    }
                }
                for (let i = 1; i < 8; i++) {
                    if (y + i > 7) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x, y + i, board);
                    if (piece == null) {
                        moves.push({X: x, Y: y + i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x, Y: y + i});
                        break;
                    } else {
                        break;
                    }
                }
                for (let i = 1; i < 8; i++) {
                    if (y - i < 0) {
                        break;
                    }
                    let piece = Chess_board._check_piece_on_cell(x, y - i, board);
                    if (piece == null) {
                        moves.push({X: x, Y: y - i});
                    } else if (piece.black !== black_turn) {
                        moves.push({X: x, Y: y - i});
                        break;
                    } else {
                        break;
                    }
                }
                return moves;
            }
        }
        this.King = class King extends this.Piece {
            constructor(x, y, black) {
                super("king", x, y, black);
            }

            get_moves(board) {
                let x = this.x_pos;
                let y = this.y_pos;
                const where_to_check = [
                    {X: x + 1, Y: y},
                    {X: x - 1, Y: y},
                    {X: x + 1, Y: y + 1},
                    {X: x + 1, Y: y - 1},
                    {X: x - 1, Y: y + 1},
                    {X: x - 1, Y: y - 1},
                    {X: x, Y: y + 1},
                    {X: x, Y: y - 1}
                ];
                let moves = [];
                for (let cp of where_to_check) {
                    if (0 <= cp.X && cp.X < 8 && 0 <= cp.Y && cp.Y < 8) {
                        let piece = Chess_board._check_piece_on_cell(cp.X, cp.Y, board);
                        if (piece == null) {
                            moves.push(cp);
                        } else if (piece.black !== black_turn) {
                            moves.push(cp);
                        }
                    }
                }
                return moves;
            }
        }

        //Default piece positions
        this.piece_positions = [
            new this.Pawn(0, 1, true),
            new this.Pawn(1, 1, true),
            new this.Pawn(2, 1, true),
            new this.Pawn(3, 1, true),
            new this.Pawn(4, 1, true),
            new this.Pawn(5, 1, true),
            new this.Pawn(6, 1, true),
            new this.Pawn(7, 1, true),
            new this.Rook(0, 0, true),
            new this.Rook(7, 0, true),
            new this.Knight(1, 0, true),
            new this.Knight(6, 0, true),
            new this.Bishop(2, 0, true),
            new this.Bishop(5, 0, true),
            new this.Queen(3, 0, true),
            new this.King(4, 0, true),
            new this.Pawn(0, 6, false),
            new this.Pawn(1, 6, false),
            new this.Pawn(2, 6, false),
            new this.Pawn(3, 6, false),
            new this.Pawn(4, 6, false),
            new this.Pawn(5, 6, false),
            new this.Pawn(6, 6, false),
            new this.Pawn(7, 6, false),
            new this.Rook(0, 7, false),
            new this.Rook(7, 7, false),
            new this.Knight(1, 7, false),
            new this.Knight(6, 7, false),
            new this.Bishop(2, 7, false),
            new this.Bishop(5, 7, false),
            new this.Queen(3, 7, false),
            new this.King(4, 7, false)
        ];

        //Onclick event listener
        this._game_canvas.addEventListener('click', (event) => {
            //Setting variables
            let x_pos = event.clientX - this._game_canvas.offsetLeft;
            let y_pos = event.clientY - this._game_canvas.offsetTop;
            //Clicked cell position
            let clicked_cell = this._get_cell_from_click(x_pos, y_pos);
            //Piece on the clicked cell
            let piece_on_cell = Chess_board._check_piece_on_cell(clicked_cell.x_pos, clicked_cell.y_pos, this.piece_positions);
            //If piece on cell is not colored the rounder than ignore it
            if (piece_on_cell && piece_on_cell.black !== black_turn) {
                piece_on_cell = null;
            }
            if (selected_piece == null) {
                this._select_piece_and_get_moves(piece_on_cell);
            } else {
                let moves = this._select_piece_and_get_moves(selected_piece);
                if (this._check_if_valid_move(clicked_cell.x_pos, clicked_cell.y_pos, moves)) {
                    console.log("Valid move!");
                    this._full_game.push(this._clone_positions(this.piece_positions));
                    this._move_piece_to(clicked_cell.x_pos, clicked_cell.y_pos, selected_piece);
                    console.log("Piece moved!");
                    //Side changer
                    //Ready for next round
                    selected_piece = null;
                    black_turn = !black_turn;
                    this._change_sides();
                    //Checking if check or checkmate
                    if (this._is_check_mate()) {
                        this._draw_check_mate();
                    } else if (this._is_check(this.piece_positions)) {
                        this._draw_check();
                    }
                } else {
                    console.log("Invalid move!");
                    this._select_piece_and_get_moves(piece_on_cell);
                }
            }
        }, false);
    }

    //
    //Functions for the game
    //

    //Convert coordinates to string in the format of 'x:y'
    //Used for mapping moves and piece positions
    coordinates_to_string(x, y) {
        return `${x}:${y}`;
    }

    //Changes the sides
    _change_sides() {
        for (let p of this.piece_positions) {
            p.x_pos = 7 - p.x_pos;
            p.y_pos = 7 - p.y_pos;
        }
        this._draw_table();
    }

    //
    //Draws one piece
    //
    _draw_piece(piece) {
        if (!piece instanceof this.Piece) {
            throw new Error(`Parameter error: ${piece} -> Parameter is not a Piece`);
        }
        if (piece.status !== "active") {
            return;
        }
        let image_coordinates = {
            x: piece.piece_code * PIECE_IMAGE_SIZE,
            y: (piece.black ? 0 : PIECE_IMAGE_SIZE)
        }
        this._game_ctx.drawImage(this._pieces_img, image_coordinates.x, image_coordinates.y,
            PIECE_IMAGE_SIZE, PIECE_IMAGE_SIZE, piece.x_pos * this._cell_size, piece.y_pos * this._cell_size, this._cell_size, this._cell_size);
    }

    //
    //Draws the pieces
    //
    _draw_pieces() {
        this._game_ctx.clearRect(0, 0, this._canvas_size, this._canvas_size);
        for (let p of this.piece_positions) {
            this._draw_piece(p);
        }
    }

    //
    //Draws the board with the actual positions of the pieces
    //
    _draw_table() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((j % 2 === 0 && i % 2 === 1) || (j % 2 === 1 && i % 2 === 0)) {
                    this._board_ctx.fillStyle = this._color2;
                } else {
                    this._board_ctx.fillStyle = this._color1;
                }
                this._board_ctx.fillRect(i * this._cell_size, j * this._cell_size, this._cell_size, this._cell_size);
            }
        }
        this._draw_pieces();
    }

    //
    //Returns a cell coordinate by the x, y coordinates of the click
    //
    _get_cell_from_click(x, y) {
        return {
            x_pos: Math.floor(x / this._cell_size),
            y_pos: Math.floor(y / this._cell_size)
        };
    }

    //
    //Returns the piece on the given coordinates, filters out the pieces that are not in the next players team
    //
    static _check_piece_on_cell(x, y, board) {
        if (typeof x !== "number" || typeof y !== "number") {
            throw TypeError("[!] Invalid argument! (Chess_board.check_piece_on_cell)" + this.coordinates_to_string(x, y));
        }
        return board.find(p => p.x_pos === x && p.y_pos === y && p.status === "active");
    }

    //
    //Highlights the selected cell with the highlight colors by x, y coordinates
    //
    _highlight_cell(x, y) {
        let origoX = x * this._cell_size + this._cell_size / 2;
        let origoY = y * this._cell_size + this._cell_size / 2;
        let rad = this._cell_size / 9;
        let ctx = this._game_ctx;

        //Customizing highlight circle
        ctx.beginPath();
        //Drawing a circle
        ctx.arc(origoX, origoY, rad, 0, 2 * Math.PI, false);
        let piece_on_cell = Chess_board._check_piece_on_cell(x, y, this.piece_positions); //Checking which piece is on the cell, and how to highlight it
        if (piece_on_cell == null || (black_turn && piece_on_cell.black) || (!black_turn && !piece_on_cell.black)) {
            ctx.strokeStyle = this._hightlight_color1;
        } else {
            ctx.strokeStyle = this._hightlight_color2;
        }
        ctx.lineWidth = 11;
        ctx.stroke();
        ctx.closePath();
    }

    //
    //Selects the piece and highlights the possible moves
    //Returns the possible moves
    //
    _select_piece_and_get_moves(piece) {
        if (piece == null) {
            console.log("No piece on cell!");
            return null;
        }
        if (selected_piece != null) {
            this._draw_table();
        }
        selected_piece = piece;
        let possible_moves = this._get_valid_moves(piece);
        for (let m of possible_moves) {
            this._highlight_cell(m.X, m.Y);
        }
        return possible_moves;
    }

    //Returns the valid moves for the given piece
    _get_valid_moves(piece) {
        const all_moves = piece.get_moves(this.piece_positions);
        let valid_moves = [];
        let test_positions = this._clone_positions(this.piece_positions);
        let test_piece = test_positions.filter(x => x.x_pos === piece.x_pos && x.y_pos === piece.y_pos && x.black === black_turn)[0];
        const saved_piece_pos = {X: test_piece.x_pos, Y: test_piece.y_pos};

        for (let move of all_moves) {
            test_piece.x_pos = saved_piece_pos.X;
            test_piece.y_pos = saved_piece_pos.Y;
            let p = Chess_board._check_piece_on_cell(move.X, move.Y, test_positions);
            if (p && p.x_pos === move.X && p.y_pos === move.Y) {
                p.status = "inactive";
                test_piece.x_pos = move.X;
                test_piece.y_pos = move.Y;
                if (!this._is_check(test_positions)) {
                    valid_moves.push(move);
                }
                p.status = "active";
                continue;
            }
            test_piece.x_pos = move.X;
            test_piece.y_pos = move.Y;
            if (!this._is_check(test_positions)) {
                valid_moves.push(move);
            }

        }
        piece.x_pos = saved_piece_pos.X;
        piece.y_pos = saved_piece_pos.Y;
        return valid_moves;
    }

    _is_check(piece_positions) {
        let team = piece_positions.filter(x => x.black === black_turn);
        let enemy = piece_positions.filter(x => x.black !== black_turn);
        enemy = enemy.filter(x => x.status === "active");
        team = team.filter(x => x.status === "active");
        let king_pos = team.find(x => x.piece_code === KING);
        this._change_sides();
        black_turn = !black_turn;
        for (let t of enemy) {
            let moves = t.get_moves(piece_positions);
            for (let m of moves) {
                if (m.X === king_pos.x_pos && m.Y === king_pos.y_pos) {
                    this._change_sides();
                    black_turn = !black_turn;
                    return t;
                }
            }
        }
        this._change_sides();
        black_turn = !black_turn;
        return false;
    }

    //
    //Checks if the clicked cell is a valid move
    //Return true if x:y is in the moves, false otherwise
    //
    _check_if_valid_move(x, y, moves) {
        if (moves.length === 0) {
            return false;
        }
        let clicked = this.coordinates_to_string(x, y);
        let mapped_moves = moves.map(element => this.coordinates_to_string(element.X, element.Y));
        if (mapped_moves.includes(clicked)) {
            return true;
        }
    }

    //
    //Check if there is checkmate
    //
    _is_check_mate() {
        let tesam = this.piece_positions.filter(p => p.black === black_turn);
        for (let p of tesam) {
            if (this._get_valid_moves(p).length > 0) {
                return false;
            }
        }
        console.log(black_turn ? "White wins!" : "Black wins!");
        return true;
    }

    //Draws check banner to the canvas
    _draw_check() {
        this._draw_table();
        this._game_ctx.fillStyle = this._text_color;
        this._game_ctx.font = "42px Comic Sans Ms";
        this._game_ctx.fillText("CHECK", this._canvas_size / 3, this._canvas_size / 2);
    }

    //Draws check mate banner to the canvas
    _draw_check_mate() {
        this._draw_table();
        this._game_ctx.fillStyle = this._text_color;
        this._game_ctx.font = "42px Comic Sans Ms";
        this._game_ctx.fillText("CHECK MATE", this._canvas_size / 6, this._canvas_size / 2);
        this._game_ctx.fillText((black_turn ? "White wins!" : "Black wins!"), this._canvas_size / 4, this._canvas_size / 2 + 52);
    }

    //
    //Clones the piece positions fto store
    //
    _clone_positions(from) {
        if (typeof from !== "object") {
            console.log(from);
            throw Error("Invalid argument!");
        }
        let clone = [];
        for (let p of this.piece_positions) {
            if (p instanceof this.Pawn) {
                clone.push(new this.Pawn(p.x_pos, p.y_pos, p.black));
            } else if (p instanceof this.Rook) {
                clone.push(new this.Rook(p.x_pos, p.y_pos, p.black));
            } else if (p instanceof this.Knight) {
                clone.push(new this.Knight(p.x_pos, p.y_pos, p.black));
            } else if (p instanceof this.Bishop) {
                clone.push(new this.Bishop(p.x_pos, p.y_pos, p.black));
            } else if (p instanceof this.Queen) {
                clone.push(new this.Queen(p.x_pos, p.y_pos, p.black));
            } else {
                clone.push(new this.King(p.x_pos, p.y_pos, p.black));
            }
        }
        return clone;
    }

    //
    //Moves the given piece to x:y
    //
    _move_piece_to(x, y, piece) {

        this._kick_down_piece(x, y);

        if (piece instanceof this.Piece) {
            piece.x_pos = x;
            piece.y_pos = y;
        }
        this._draw_table();
        this._draw_pieces();
    }

    //
    //Removes piece from x:y
    //
    _kick_down_piece(x, y) {
        //Removing piece if kicked down
        let piece_on_cell = Chess_board._check_piece_on_cell(x, y, this.piece_positions);
        if (piece_on_cell != null) {
            console.log("Kicked down piece is : " + piece_on_cell.to_string());
            piece_on_cell.status = "inactive";
        }
        this.piece_positions = this.piece_positions.filter(p => p.status === "active");
    }

    //Moves back one move
    back() {
        console.log("Back!");
        if (this._full_game.length === 1) {
            console.log("Default");
            this.restart();
        } else {
            this.piece_positions = this._full_game.pop();
            black_turn = !black_turn;
            selected_piece = null;
            this._draw_table();
        }
    }

    //Clears the canvases
    _clear() {
        this._game_ctx.clearRect(0, 0, this._canvas_size, this._canvas_size);
        this._board_ctx.clearRect(0, 0, this._canvas_size, this._canvas_size);
    }

    //Starts the game (Draws the board)
    start() {
        this._draw_table();
    }

    //Restarts the game
    restart() {
        this._clear();
        this.piece_positions = [
            new this.Pawn(0, 1, true),
            new this.Pawn(1, 1, true),
            new this.Pawn(2, 1, true),
            new this.Pawn(3, 1, true),
            new this.Pawn(4, 1, true),
            new this.Pawn(5, 1, true),
            new this.Pawn(6, 1, true),
            new this.Pawn(7, 1, true),
            new this.Rook(0, 0, true),
            new this.Rook(7, 0, true),
            new this.Knight(1, 0, true),
            new this.Knight(6, 0, true),
            new this.Bishop(2, 0, true),
            new this.Bishop(5, 0, true),
            new this.Queen(3, 0, true),
            new this.King(4, 0, true),
            new this.Pawn(0, 6, false),
            new this.Pawn(1, 6, false),
            new this.Pawn(2, 6, false),
            new this.Pawn(3, 6, false),
            new this.Pawn(4, 6, false),
            new this.Pawn(5, 6, false),
            new this.Pawn(6, 6, false),
            new this.Pawn(7, 6, false),
            new this.Rook(0, 7, false),
            new this.Rook(7, 7, false),
            new this.Knight(1, 7, false),
            new this.Knight(6, 7, false),
            new this.Bishop(2, 7, false),
            new this.Bishop(5, 7, false),
            new this.Queen(3, 7, false),
            new this.King(4, 7, false)
        ];
        this._full_game = [];
        selected_piece = null;
        black_turn = false;
        this._draw_table();
    }

}

function main() {
    create_control_panel();
    get_canvases();
    let start_button = document.getElementById("start_button");
    let back_button = document.getElementById("back_button");

    let game_table = new Chess_board();
    let game = false;

    start_button.addEventListener("click", () => {
        if (!game) {
            game = true;
            start_button.innerText = "Restart game";
            game_table.start();
        } else {
            game_table.restart();
        }
    }, false);

    back_button.addEventListener("click", () => {
        //Setting back to previous position
        game_table.back();
    }, false);
}