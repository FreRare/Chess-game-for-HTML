//Chess game for browsers in JAVASCRIPT
//Made by: FreRare aka Takable
//For usage you need two html canvas with the following ids:
//Change names to personalize
const game_canvas_id = "pieces";
const board_canvas_id = "board";
//Id of the container div:
const container_div_id = "chess_container";
//Id of the control panel div:
const cpanel_div_id = "chess_control_panel";
//IMPORTANT!!
//The following function initialises the canvases with the needed css formats and appends it to the container div
//Positions are important because the canvases are layered
//Call the function at body onload among main()
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
function create_cpanel() {
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

//Class that represents a piece
//Has a name, position, black or white, code and status ('active'/'inactive')
class Piece {
    constructor(name, row = 0, col = 0, black = false, status = "active") {
        this._name = name;
        this.coordinates = {
            X: col, Y: row
        };
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
        return this.coordinates.X;
    }

    get y_pos() {
        return this.coordinates.Y;
    }

    set x_pos(x) {
        if (0 <= x < 8) {
            this.coordinates.X = x;
        } else {
            alert("Invalid coordinate!");
        }
    }

    set y_pos(y) {
        if (0 <= y < 8) {
            this.coordinates.Y = y;
        } else {
            alert("Invalid coordinate!");
        }
    }

    to_string() {
        return `${(this.black ? "Black" : "White")} ${this.name} piece at:\n\tx -> ${this.x_pos}\n\ty -> ${this.y_pos}\n
                    `;
    }

}

//The default positions of pieces
const default_positions = {
    BLACK: [
        new Piece("pawn", 1, 0, true, "active"),
        new Piece("pawn", 1, 1, true, "active"),
        new Piece("pawn", 1, 2, true, "active"),
        new Piece("pawn", 1, 3, true, "active"),
        new Piece("pawn", 1, 4, true, "active"),
        new Piece("pawn", 1, 5, true, "active"),
        new Piece("pawn", 1, 6, true, "active"),
        new Piece("pawn", 1, 7, true, "active"),
        new Piece("rook", 0, 0, true, "active"),
        new Piece("rook", 0, 7, true, "active"),
        new Piece("knight", 0, 1, true, "active"),
        new Piece("knight", 0, 6, true, "active"),
        new Piece("bishop", 0, 2, true, "active"),
        new Piece("bishop", 0, 5, true, "active"),
        new Piece("king", 0, 3, true, "active"),
        new Piece("queen", 0, 4, true, "active")
    ],
    WHITE: [
        new Piece("pawn", 6, 0, false, "active"),
        new Piece("pawn", 6, 1, false, "active"),
        new Piece("pawn", 6, 2, false, "active"),
        new Piece("pawn", 6, 3, false, "active"),
        new Piece("pawn", 6, 4, false, "active"),
        new Piece("pawn", 6, 5, false, "active"),
        new Piece("pawn", 6, 6, false, "active"),
        new Piece("pawn", 6, 7, false, "active"),
        new Piece("rook", 7, 0, false, "active"),
        new Piece("rook", 7, 7, false, "active"),
        new Piece("knight", 7, 1, false, "active"),
        new Piece("knight", 7, 6, false, "active"),
        new Piece("bishop", 7, 2, false, "active"),
        new Piece("bishop", 7, 5, false, "active"),
        new Piece("king", 7, 3, false, "active"),
        new Piece("queen", 7, 4, false, "active")
    ]
}

//Stores the selected piece and which side's turn it is
let selected_piece = null;
let black_turn = false;

//Converts coordinates to string in the format of 'x:y'
//Used for mapping moves and piece positions
function coordinates_to_string(x, y) {
    return `${x}:${y}`;
}


//The class that implements the game functions
class Board {
    constructor() {
        this._game_canvas = document.getElementById(game_canvas_id);  //The game canvas, where the pieces are displayed
        this._board_canvas = document.getElementById(board_canvas_id);  //Where the board is displayed
        this._game_ctx = this._game_canvas.getContext("2d");    //Contexts
        this._board_ctx = this._board_canvas.getContext("2d");
        this._canvas_size = this._game_canvas.width;                    //The size of the canvas (width = height)
        this._cell_size = this._canvas_size / 8;                        //The size of a cell
        //Change colors to customize the board
        this.color1 = `#51361a`;
        this.color2 = `#dd7f2a`;
        this.hightlight_color1 = `#00ff00`;
        this.hightlight_color2 = `#ff0000`;
        //Container for the pieces during the game
        this.piece_positions = this._clone_positions(default_positions);
        //Pieces image
        this._pieces_img = new Image();
        //Pieces image source
        this._pieces_img.src = piece_img_src;
        //Stores the whole game step by step
        this._full_game = [];
        //Onclick event listener
        this._game_canvas.addEventListener('click', (event) => {
            let x_pos = event.clientX - this._game_canvas.offsetLeft;
            let y_pos = event.clientY - this._game_canvas.offsetTop;
            let clicked_cell = this._get_cell_from_click(x_pos, y_pos);
            let piece_on_cell = this._check_piece_on_cell(clicked_cell.x_pos, clicked_cell.y_pos);
            let possible_moves;
            if (selected_piece == null) {
                this._select_piece_and_get_moves(piece_on_cell);
            } else {
                possible_moves = this._select_piece_and_get_moves(selected_piece);
                if (this._check_if_valid_move(clicked_cell.x_pos, clicked_cell.y_pos, possible_moves)) {
                    console.log("Valid move!");
                    this._full_game.push(this._clone_positions(this.piece_positions));
                    this._move_piece_to(clicked_cell.x_pos, clicked_cell.y_pos, selected_piece);
                    console.log("Piece moved");
                    if (this._is_check()) {
                        console.log("Check!");
                    }
                    selected_piece = null;
                    black_turn = !black_turn;
                    if (this._is_check_mate()) {
                        console.log("Check mate!");
                        console.log("Finaly finsihed this fuck*ng shit program!!!!!");
                    }
                } else {
                    console.log("Cannot move piece to cell!");
                    this._select_piece_and_get_moves(piece_on_cell);
                }
            }
        }, false);
    }

    //
    //Functions for the game
    //

    //
    //Clones the piece positions fto store
    //
    _clone_positions(from) {
        if (typeof from !== "object") {
            console.log(from);
            throw Error("Invalid argument!");
        }
        let clone = { WHITE: [], BLACK: [] };
        for (let w of from.WHITE) {
            clone.WHITE.push(new Piece(w.name, w.y_pos, w.x_pos, w.black, w.status));
        }
        for (let b of from.BLACK) {
            clone.BLACK.push(new Piece(b.name, b.y_pos, b.x_pos, b.black, b.status));
        }
        return clone;
    }

    //
    //Returns the piece on the given coordinates
    //If both defined, checks both side, otherwise just the side in turn
    //
    _check_piece_on_cell(x, y, both = false) {
        if (this.piece_positions === undefined) {
            throw new Error("Positions are undefined!");
        }
        let piece = null;
        const mapped_white = this.piece_positions.WHITE.map(x => coordinates_to_string(x.coordinates.X, x.coordinates.Y));
        const mapped_black = this.piece_positions.BLACK.map(x => coordinates_to_string(x.coordinates.X, x.coordinates.Y));
        if (both) {
            let p = this.piece_positions.WHITE.find(element => element.x_pos === x && element.y_pos === y);
            if (p) {
                piece = p;
            } else {
                piece = this.piece_positions.BLACK.find(element => element.x_pos === x && element.y_pos === y);
            }
        } else {
            if (black_turn) {
                if (mapped_black.includes(coordinates_to_string(x, y))) {
                    piece = this.piece_positions.BLACK.find(element => element.x_pos === x && element.y_pos === y);
                }
            } else {
                if (mapped_white.includes(coordinates_to_string(x, y))) {
                    piece = this.piece_positions.WHITE.find(element => element.x_pos === x && element.y_pos === y);
                }
            }
        }
        if (piece && piece.status === "active") {
            return piece;
        } else {
            return null;
        }
    }

    //
    //Draws the pieces
    //
    _draw_pieces() {
        this._game_ctx.clearRect(0, 0, this._canvas_size, this._canvas_size);
        for (let p of this.piece_positions.BLACK) {
            this._draw_piece(p);
        }
        for (let p of this.piece_positions.WHITE) {
            this._draw_piece(p);
        }
    }

    //
    //Draws one piece
    //
    _draw_piece(piece) {
        if (!piece instanceof Piece) {
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
    //Sets the color of a cell
    //
    _get_cell_color(x, y) {
        if ((y % 2 === 0 && x % 2 === 1) || (y % 2 === 1 && x % 2 === 0)) {
            return this.color1;
        } else {
            return this.color2;
        }
    }

    //
    //Draws the board with the actual positions of the pieces
    //
    _draw_table() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this._board_ctx.fillStyle = this._get_cell_color(i, j);
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
    //Highlights the selected cell with the highlight colors by x, y coordinates
    //
    _highlight_cell(x, y) {
        let piece_on_cell = this._check_piece_on_cell(x, y, true);
        if (piece_on_cell == null || (black_turn && piece_on_cell.black) || (!black_turn && !piece_on_cell.black)) {
            this._board_ctx.strokeStyle = this.hightlight_color1;
        } else {
            this._board_ctx.strokeStyle = this.hightlight_color2;
        }
        this._board_ctx.lineWidth = 2;
        //Change to customize border of highlight
        let border = 3;
        this._board_ctx.strokeRect(x * this._cell_size + border, y * this._cell_size + border, this._cell_size - border * 2, this._cell_size - border * 2);
    }

    //Returns every move for a pawn at x,y
    _get_pawn_moves(x, y) {
        if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("Invalid arguments!");
        }
        let moves = [];
        if (!black_turn) {
            //If white is next:
            if (y === 6) {
                for (let i = 1; i < 3; i++) {
                    if (this._check_piece_on_cell(x, y - i, true) == null) {
                        moves.push({ X: x, Y: y - i });
                    } else {
                        break;
                    }
                }
            } else {
                if (this._check_piece_on_cell(x, y - 1, true) == null) {
                    moves.push({ X: x, Y: y - 1 });
                }
            }
            if (this._check_piece_on_cell(x + 1, y - 1, true) != null &&
                this._check_piece_on_cell(x + 1, y - 1, true).black) {
                moves.push({ X: x + 1, Y: y - 1 });
            }
            if (this._check_piece_on_cell(x - 1, y - 1, true,) != null &&
                this._check_piece_on_cell(x - 1, y - 1, true,).black) {
                moves.push({ X: x - 1, Y: y - 1 });
            }
        } else {
            //If black is next:
            if (y === 1) {
                for (let i = 1; i < 3; i++) {
                    if (this._check_piece_on_cell(x, y + i, true) == null) {
                        moves.push({ X: x, Y: y + i });
                    } else {
                        break;
                    }
                }
            } else {
                if (this._check_piece_on_cell(x, y + 1, true) == null) {
                    moves.push({ X: x, Y: y + 1 });
                }
            }
            if (this._check_piece_on_cell(x + 1, y + 1, true) != null &&
                !this._check_piece_on_cell(x + 1, y + 1, true).black) {
                moves.push({ X: x + 1, Y: y + 1 });
            }
            if (this._check_piece_on_cell(x - 1, y + 1, true) != null &&
                !this._check_piece_on_cell(x - 1, y + 1, true).black) {
                moves.push({ X: x - 1, Y: y + 1 });
            }
        }
        return moves;
    }

    //Returns every move for a rook at x,y
    _get_rook_moves(x, y) {
        let moves = [];
        for (let i = 1; i < 8; i++) {
            if (x + i > 7) {
                break;
            }
            let piece = this._check_piece_on_cell(x + i, y, true);
            if (piece == null) {
                moves.push({ X: x + i, Y: y });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x + i, Y: y });
                break;
            } else {
                break;
            }
        }
        for (let i = 1; i < 8; i++) {
            if (x - i < 0) {
                break;
            }
            let piece = this._check_piece_on_cell(x - i, y, true);
            if (piece == null) {
                moves.push({ X: x - i, Y: y });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x - i, Y: y });
                break;
            } else {
                break;
            }
        }
        for (let i = 1; i < 8; i++) {
            if (y + i > 7) {
                break;
            }
            let piece = this._check_piece_on_cell(x, y + i, true);
            if (piece == null) {
                moves.push({ X: x, Y: y + i });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x, Y: y + i });
                break;
            } else {
                break;
            }
        }
        for (let i = 1; i < 8; i++) {
            if (y - i < 0) {
                break;
            }
            let piece = this._check_piece_on_cell(x, y - i, true);
            if (piece == null) {
                moves.push({ X: x, Y: y - i });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x, Y: y - i });
                break;
            } else {
                break;
            }
        }
        return moves;
    }

    //Returns every move for a knight at x,y
    _get_knight_moves(x, y) {
        const where_to_check = [
            { X: x + 1, Y: y - 2 },
            { X: x + 2, Y: y - 1 },
            { X: x + 2, Y: y + 1 },
            { X: x + 1, Y: y + 2 },
            { X: x - 1, Y: y + 2 },
            { X: x - 2, Y: y + 1 },
            { X: x - 2, Y: y - 1 },
            { X: x - 1, Y: y - 2 }
        ];
        let moves = [];
        for (let cp of where_to_check) {
            if (cp.X > 7 || cp.X < 0 || cp.Y > 7 || cp.Y < 0) {
                continue;
            }
            if (this._check_piece_on_cell(cp.X, cp.Y) == null) {
                moves.push(cp);
            } else if (this._check_piece_on_cell(cp.X, cp.Y).black && !black_turn) {
                moves.push(cp);
            }
        }
        return moves;
    }

    //Returns every move for a bishop at x,y
    _get_bishop_moves(x, y) {
        let moves = [];

        //x+ y- -> right-up movement
        for (let i = 1; i < 8; i++) {
            if (x === 7 || y === 0 || x + i > 7 || y - i < 0) {
                break;
            }
            let piece = this._check_piece_on_cell(x + i, y - i, true);
            if (piece == null) {
                moves.push({ X: x + i, Y: y - i });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x + i, Y: y - i });
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
            let piece = this._check_piece_on_cell(x + i, y + i, true);
            if (piece == null) {
                moves.push({ X: x + i, Y: y + i });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x + i, Y: y + i });
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
            let piece = this._check_piece_on_cell(x - i, y + i, true);
            if (piece == null) {
                moves.push({ X: x - i, Y: y + i });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x - i, Y: y + i });
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
            let piece = this._check_piece_on_cell(x - i, y - i, true);
            if (piece == null) {
                moves.push({ X: x - i, Y: y - i });
            } else if (piece.black !== black_turn) {
                moves.push({ X: x - i, Y: y - i });
                break;
            } else {
                break;
            }
        }

        return moves;
    }

    //Returns every move for a queen at x,y
    _get_queen_moves(x, y) {
        let r_moves = this._get_rook_moves(x, y);
        let b_moves = this._get_bishop_moves(x, y);
        return r_moves.concat(b_moves);
    }

    //Returns every move for a king at x,y
    _get_king_moves(x, y) {
        const where_to_check = [
            { X: x + 1, Y: y },
            { X: x - 1, Y: y },
            { X: x + 1, Y: y + 1 },
            { X: x + 1, Y: y - 1 },
            { X: x - 1, Y: y + 1 },
            { X: x - 1, Y: y - 1 },
            { X: x, Y: y + 1 },
            { X: x, Y: y - 1 }
        ];
        let moves = [];
        for (let cp of where_to_check) {
            if (0 <= cp.X && cp.X < 8 && 0 <= cp.Y && cp.Y < 8) {
                let piece = this._check_piece_on_cell(cp.X, cp.Y);
                if (piece == null) {
                    moves.push(cp);
                } else if (piece.black !== black_turn) {
                    moves.push(cp);
                }
            }
        }
        return moves;
    }

    //Returns every move for the given piece
    _get_moves(piece) {
        let moves;
        if (piece.status === "inactive") {
            return [];
        }
        switch (piece.piece_code) {
            case PAWN:
                moves = this._get_pawn_moves(piece.x_pos, piece.y_pos);
                break;
            case ROOK:
                moves = this._get_rook_moves(piece.x_pos, piece.y_pos);
                break;
            case KNIGHT:
                moves = this._get_knight_moves(piece.x_pos, piece.y_pos);
                break;
            case BISHOP:
                moves = this._get_bishop_moves(piece.x_pos, piece.y_pos);
                break;
            case QUEEN:
                moves = this._get_queen_moves(piece.x_pos, piece.y_pos);
                break;
            case KING:
                moves = this._get_king_moves(piece.x_pos, piece.y_pos);
                break;
            default:
                moves = null;
        }
        return moves;
    }


    //
    //Check if there is checkmate
    //
    _is_check_mate() {
        let team = (black_turn ? this.piece_positions.BLACK : this.piece_positions.WHITE);
        for (let p of team) {
            if (this._get_valid_moves(p).length > 0) {
                return false;
            }
        }
        console.log(black_turn ? "White wins!" : "Black wins!");
        return true;
    }

    //
    //Returns true if the actual team's king is in check false otherwise
    //If board is given checks the whole board for check, used when validating steps
    //
    _is_check(board = undefined) {

        //
        //Not working! Check test before step for validation
        //
        if (board) {
            let enemy = (black_turn ? board.WHITE : board.BLACK);
            let team = (black_turn ? board.BLACK : board.WHITE);
            enemy = enemy.filter(x => x.status === "active");
            let king_pos = team.find(x => x.piece_code === KING);
            console.log(coordinates_to_string(king_pos.x_pos, king_pos.y_pos));
            black_turn = !black_turn;
            for (let t of enemy) {
                let moves = this._get_moves(t);
                for (let m of moves) {
                    if (m.X === king_pos.x_pos && m.Y === king_pos.y_pos) {
                        console.log(t.to_string());
                        console.log("Possible check!");
                        black_turn = !black_turn;
                        return true, t;
                    }
                }
            }
            black_turn = !black_turn;
            return false;
        }

        //
        //Check test for every round after each step
        //
        const black_king = this.piece_positions.BLACK.find(x => x.piece_code === KING);
        for (let wp of this.piece_positions.WHITE) {
            let possible_moves = this._get_moves(wp);
            for (let m of possible_moves) {
                if (m.X === black_king.x_pos && m.Y === black_king.y_pos) {
                    console.log("Check for black!");
                    console.log(wp.to_string());
                    return true;
                }
            }
        }

        const white_king = this.piece_positions.WHITE.find(x => x.piece_code === KING);
        for (let bp of this.piece_positions.BLACK) {
            let possible_moves = this._get_moves(bp);
            for (let m of possible_moves) {
                if (m.X === white_king.x_pos && m.Y === white_king.y_pos) {
                    console.log("Check for white!");
                    console.log(bp.to_string());
                    return true;
                }
            }
        }
        return false;
    }

    //
    //Validates the moves given by _get_moves(), filters check positions
    //Returns possible moves
    //
    _get_valid_moves(piece) {

        const saved = this.piece_positions;
        let test_piece = piece;
        const saved_piece_pos = { X: piece.x_pos, Y: piece.y_pos };
        const moves = this._get_moves(piece);
        let valid_moves = [];

        for (let m of moves) {
            let p = this._is_check(saved);
            console.log("Checker piece position:" + coordinates_to_string(p.x_pos, p.y_pos));
            console.log("Move postitions:" + coordinates_to_string(m.X, m.Y));
            if (p && p.x_pos === m.X && p.y_pos === m.Y) {
                p.status = "inactive";
                test_piece.x_pos = m.X;
                test_piece.y_pos = m.Y;
                if (!this._is_check(saved)) {
                    console.log("With kick:")
                    console.log(m);
                    valid_moves.push(m);
                }
                p.status = "active";
                continue;
            }
            test_piece.x_pos = m.X;
            test_piece.y_pos = m.Y;
            if (!this._is_check(saved)) {
                console.log("Valid:")
                console.log(m);
                valid_moves.push(m);
            }

        }
        piece.x_pos = saved_piece_pos.X;
        piece.y_pos = saved_piece_pos.Y;
        console.log(moves);
        console.log(valid_moves);
        return valid_moves;
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

        this._highlight_cell(selected_piece.x_pos, selected_piece.y_pos);
        for (let m of possible_moves) {
            this._highlight_cell(m.X, m.Y);
        }
        return possible_moves;
    }

    //
    //Checks if the clicked cell is a valid move
    //Return true if x:y is in the moves, false otherwise
    //
    _check_if_valid_move(x, y, moves) {
        if (moves.length === 0) {
            return false;
        }
        let clicked = coordinates_to_string(x, y);
        let mapped_moves = moves.map(element => coordinates_to_string(element.X, element.Y));
        if (mapped_moves.includes(clicked)) {
            return true;
        }
    }

    //
    //Removes piece from x:y
    //
    _kick_down_piece(x, y) {
        //Removing piece if kicked down
        let piece_on_cell = this._check_piece_on_cell(x, y, true);
        if (piece_on_cell != null) {
            console.log("Kicked down piece is : " + piece_on_cell.to_string());
            piece_on_cell.status = "inactive";
        } else {
            return;
        }
        if (piece_on_cell.black) {
            this.piece_positions.BLACK = this.piece_positions.BLACK.filter(x => x.status === "active");
        } else {
            this.piece_positions.WHITE = this.piece_positions.WHITE.filter(x => x.status === "active");
        }
    }

    //
    //Moves the given piece to x:y
    //
    _move_piece_to(x, y, piece) {

        this._kick_down_piece(x, y);

        if (piece instanceof Piece) {
            piece.x_pos = x;
            piece.y_pos = y;
        }
        this._draw_table();
        this._draw_pieces();
    }

    _back() {
        console.log("Back!");
        if (this._full_game.length === 0) {
            console.log("Default");
            this.restart();
        } else {
            this.piece_positions = this._clone_positions(this._full_game.pop());
            black_turn = !black_turn;
            selected_piece = null;
        }
    }

    _clear() {
        this._game_ctx.clearRect(0, 0, this._canvas_size, this._canvas_size);
        this._board_ctx.clearRect(0, 0, this._canvas_size, this._canvas_size);
    }

    start() {
        this._draw_table();
    }

    restart() {
        this._clear();
        this.piece_positions = this._clone_positions(default_positions);
        this._full_game = [];
        this._round_counter = 0;
        selected_piece = null;
        black_turn = false;
        this._draw_table();
    }
}


//Main
//Game start
function main() {
    let player1 = document.getElementById("player1");
    let player2 = document.getElementById("player2");
    let start_button = document.getElementById("start_button");
    let back_button = document.getElementById("back_button");

    let game_table = new Board();
    let game = false;

    start_button.addEventListener("click", () => {
        //getting player names and starting game
        let player1_name = player1.value;
        let player2_name = player2.value;
        if (!game) {
            if (player1_name.length < 3 || player2_name.length < 3) {
                alert("Please give player names!");
            } else {
                game = true;
                start_button.innerText = "Restart game";
                game_table.start();
            }
        } else {
            game_table.restart();
        }
    }, false);

    back_button.addEventListener("click", () => {
        //Setting back to previous position
        //Need to store all positions in every round!
        game_table._back();
        game_table._draw_table();
    }, false);
}