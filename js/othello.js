// 初期設定
let turn = 0; // 1:黒 -1:白
let board = document.getElementById('board'); // HTMLのboardを取得

// 盤面を二次元配列で設定
let board_surface = new Array(8);
for (var i = 0; i < 8; i++) {
    board_surface[i] = new Array(8);
}

// 取得したtableに盤面生成
makeBoard();

// 盤面を初期化
resetBoard();

// クリック時の処理
for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
        // 初期設定
        let select_cell = board.rows[x].cells[y];

        select_cell.onclick = function () {
            // クリックされたセルに石がない場合，石が置けるかチェック
            if (board_surface[this.parentNode.rowIndex][this.cellIndex] == 0) {
                if (checkReverse(this.parentNode.rowIndex, this.cellIndex) > 0) {
                    boardSet();
                    chengeTurn();
                }
            }
        }
    }
}

// tableに盤面を作成する関数
function makeBoard() {
    // 変数宣言
    let tr, td;

    for (var x = 0; x < 8; x++) {
        tr = document.createElement("tr"); // HTMLのtrを取得
        board.appendChild(tr);

        for (var y = 0; y < 8; y++) {
            td = document.createElement("td"); // HTMLのtdを取得
            tr.appendChild(td);
        }
    }
}

// 盤面を初期化する関数
function resetBoard() {
    // 盤面上の全ての石を初期化
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            board_surface[x][y] = 0;
        }
    }

    // 中央4マスに石を配列
    board_surface[3][3] = -1; // 4行4列目に白
    board_surface[4][3] = 1; // 5行4列目に黒
    board_surface[3][4] = 1; // 4行5列目に黒
    board_surface[4][4] = -1; // 5行5列目に白

    boardSet();

    // ターンを初期化
    turn = 0;

    chengeTurn();
}

// 盤面状況を実際の盤面へ反映させる関数
function boardSet() {
    // 初期設定
    let disc = ""; // ●:黒 ○:白

    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            if (board_surface[x][y] == 0) {
                disc = "";
            } else if (board_surface[x][y] == 1) {
                disc = "●";
            } else if (board_surface[x][y] == -1) {
                disc = "○";
            }

            board.rows[x].cells[y].innerText = disc;
        }
    }

    return true;
}

// ターンを変更する関数
function chengeTurn() {
    // 初期設定
    let turn_msg = document.getElementById('view_turn'); // HTMLのview_turnを取得
    let check_reverse_cnt = 0;
    let black_cnt = 0;
    let white_cnt = 0;

    if (turn == 0) {
        turn = 1;
        turn_msg.textContent = "黒の番です．  黒:2  白:2";
        return;
    }

    // ターンを変更
    turn *= -1;

    // 現在の盤面をバックアップ
    let board_bk = new Array(8);
    for (var i = 0; i < 8; i++) {
        board_bk[i] = new Array(8);
    }
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            board_bk[x][y] = board_surface[x][y];
        }
    }

    // 盤面上の石の数 & 石を置けるマスの数 を確認 
    for (var xx = 0; xx < 8; xx++) {
        for (var yy = 0; yy < 8; yy++) {
            if (board_surface[xx][yy] == 0) {
                check_reverse_cnt += checkReverse(xx, yy);

                // バックアップで復元
                for (var ii = 0; ii < 8; ii++) {
                    for (var jj = 0; jj < 8; jj++) {
                        board_surface[ii][jj] = board_bk[ii][jj];
                    }
                }
            } else if (board_surface[xx][yy] == 1) {
                black_cnt++;
            } else if (board_surface[xx][yy] == -1) {
                white_cnt++;
            }
        }
    }

    // 盤面上の石の数が64個 or 黒か白が0個 でゲーム終了
    if (white_cnt + black_cnt == 64 || white_cnt == 0 || black_cnt == 0) {
        if (white_cnt == black_cnt) {
            alert("勝負の結果は引き分けです．");
        } else if (white_cnt > black_cnt) {
            alert("勝負の結果は，黒:" + black_cnt + " 白:" + white_cnt + " で，白の勝ちです．");
        } else {
            alert("勝負の結果は，黒:" + black_cnt + " 白:" + white_cnt + " で，黒の勝ちです．");
        }
    } else {
        // 石を置ける場所がない場合，ターン終了
        if (check_reverse_cnt == 0) {
            if (turn == 1) {
                alert("黒の置ける場所がありません．白の番となります．");
                turn *= -1;
            } else if (turn == -1) {
                alert("白の置ける場所がありません．黒の番となります．");
                turn *= -1;
            }
        }
    }

    // ターンを表示
    if (turn == 1) {
        turn_msg.textContent = "黒の番です．  黒:" + black_cnt + "  白:" + white_cnt;
    } else if (turn == -1) {
        turn_msg.textContent = "白の番です．  黒:" + black_cnt + "  白:" + white_cnt;
    }
}

// 指定したセルに石を置いたとき，裏返せる石の数を確認する関数
function checkReverse(row_num, line_num) {
    // 初期設定
    let reverse_cnt = 0;

    // 隣り合う石を裏返せるかを確認
    reverse_cnt += reverseDiscs(row_num, line_num, -1, 0); //上
    reverse_cnt += reverseDiscs(row_num, line_num, -1, 1); //右上
    reverse_cnt += reverseDiscs(row_num, line_num, 0, 1); //右
    reverse_cnt += reverseDiscs(row_num, line_num, 1, 1); //右下
    reverse_cnt += reverseDiscs(row_num, line_num, 1, 0); //下
    reverse_cnt += reverseDiscs(row_num, line_num, 1, -1); //左下
    reverse_cnt += reverseDiscs(row_num, line_num, 0, -1); //左
    reverse_cnt += reverseDiscs(row_num, line_num, -1, -1); //左上

    return reverse_cnt;
}

// 指定したセルから指定した方向へ石を裏返す関数
function reverseDiscs(row_num, line_num, add_r, add_l) {
    // 初期設定
    let reverse_discs_cnt = 0; // 裏返した石の数
    let my_disc = 0; // 0:自分の石がない 1:自分の石がある
    let r = row_num; // 指定したセルの行
    let l = line_num; // 指定したセルの列

    // 現在の盤面をバックアップ
    let board_bk = new Array(8);
    for (var i = 0; i < 8; i++) {
        board_bk[i] = new Array(8);
    }
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            board_bk[x][y] = board_surface[x][y];
        }
    }

    // 指定したセルから指定された方向の石を裏返す
    while (true) {
        l += add_l;
        r += add_r;
        
        // 両端に到達したら終了
        if (r < 0 || r > 7 || l < 0 || l > 7) {
            break;
        }

        // 移動先のセルに石がなかったら終了
        if (board_surface[r][l] == 0) {
            break;
        }

        // 移動先のセルに自分の石があったら，石があったことを判定し終了
        if (board_surface[r][l] == turn) {
            my_disc = 1;
            break;
        }

        // 上記以外は相手の石なので，石を裏返し，その数をreverse_discs_cntに加算
        board_surface[r][l] *= -1;
        reverse_discs_cnt++;
    }

    // 移動先に自分の石がなかったら，裏返した石を元に戻す
    if (reverse_discs_cnt > 0) {
        if (my_disc == 0) {
            for (var xx = 0; xx < 8; xx++) {
                for (var yy = 0; yy < 8; yy++) {
                    board_surface[xx][yy] = board_bk[xx][yy];
                    reverse_discs_cnt = 0;
                }
            }
        } else {
            // しっかりと裏返しができていたら，指定したセルに自分の石を置く
            board_surface[row_num][line_num] = turn;
        }
    }

    return reverse_discs_cnt;
}