import numpy as np
import math
import random

ROW_COUNT = 6
COLUMN_COUNT = 7
EMPTY = 0
PLAYER = 1
AI = 2
WINDOW_LENGTH = 4

# Variabel Global untuk Tracking Laporan
node_count_ab = 0
node_count_mm = 0
tree_edges = []
pruned_columns_in_search = set()

def is_valid_location(board, col):
    return board[ROW_COUNT-1][col] == EMPTY

def get_valid_locations(board):
    return [col for col in range(COLUMN_COUNT) if is_valid_location(board, col)]

def get_next_open_row(board, col):
    for r in range(ROW_COUNT):
        if board[r][col] == EMPTY:
            return r

def drop_piece(board, row, col, piece):
    board[row][col] = piece

def winning_move(board, piece):
    for c in range(COLUMN_COUNT-3):
        for r in range(ROW_COUNT):
            if board[r][c] == piece and board[r][c+1] == piece and board[r][c+2] == piece and board[r][c+3] == piece: return True
    for c in range(COLUMN_COUNT):
        for r in range(ROW_COUNT-3):
            if board[r][c] == piece and board[r+1][c] == piece and board[r+2][c] == piece and board[r+3][c] == piece: return True
    for c in range(COLUMN_COUNT-3):
        for r in range(ROW_COUNT-3):
            if board[r][c] == piece and board[r+1][c+1] == piece and board[r+2][c+2] == piece and board[r+3][c+3] == piece: return True
    for c in range(COLUMN_COUNT-3):
        for r in range(3, ROW_COUNT):
            if board[r][c] == piece and board[r-1][c+1] == piece and board[r-2][c+2] == piece and board[r-3][c+3] == piece: return True
    return False

def evaluate_window(window, piece):
    score = 0
    opp_piece = PLAYER if piece == AI else AI
    if window.count(piece) == 4: score += 100
    elif window.count(piece) == 3 and window.count(EMPTY) == 1: score += 5
    elif window.count(piece) == 2 and window.count(EMPTY) == 2: score += 2
    if window.count(opp_piece) == 3 and window.count(EMPTY) == 1: score -= 4
    return score

def score_position(board, piece):
    score = 0
    for r in range(ROW_COUNT):
        row_array = [int(i) for i in list(board[r,:])]
        for c in range(COLUMN_COUNT-3): score += evaluate_window(row_array[c:c+WINDOW_LENGTH], piece)
    for c in range(COLUMN_COUNT):
        col_array = [int(i) for i in list(board[:,c])]
        for r in range(ROW_COUNT-3): score += evaluate_window(col_array[r:r+WINDOW_LENGTH], piece)
    for r in range(ROW_COUNT-3):
        for c in range(COLUMN_COUNT-3): score += evaluate_window([board[r+i][c+i] for i in range(WINDOW_LENGTH)], piece)
    for r in range(ROW_COUNT-3):
        for c in range(COLUMN_COUNT-3): score += evaluate_window([board[r+3-i][c+i] for i in range(WINDOW_LENGTH)], piece)
    score += random.randint(0, 3)
    return score

def is_terminal_node(board):
    return winning_move(board, PLAYER) or winning_move(board, AI) or len(get_valid_locations(board)) == 0

# FUNGSI BARU: Simulasi Murni tanpa Pruning untuk Data Tabel Laporan
def count_pure_minimax(board, depth, maximizingPlayer):
    global node_count_mm
    node_count_mm += 1
    if depth == 0 or is_terminal_node(board): return
    for col in get_valid_locations(board):
        b_copy = board.copy()
        drop_piece(b_copy, get_next_open_row(board, col), col, AI if maximizingPlayer else PLAYER)
        count_pure_minimax(b_copy, depth-1, not maximizingPlayer)

# FUNGSI UTAMA: Minimax dengan Pruning + Perekaman Tree
def minimax_ab(board, depth, alpha, beta, maximizingPlayer, use_pruning, max_depth, parent_id, root_col):
    global node_count_ab, tree_edges, pruned_columns_in_search
    node_count_ab += 1
    
    valid_locations = get_valid_locations(board)
    is_terminal = is_terminal_node(board)
    
    if depth == 0 or is_terminal:
        if is_terminal:
            if winning_move(board, AI): return (None, 1000000)
            elif winning_move(board, PLAYER): return (None, -1000000)
            else: return (None, 0)
        else:
            return (None, score_position(board, AI))

    # Syarat Wajib 3: Visualisasi dibatasi 3 level teratas agar browser tidak meledak
    capture_tree = (max_depth - depth) < 2
        
    random.shuffle(valid_locations)
    ordered_locations = valid_locations
    
    if maximizingPlayer:
        value = -math.inf
        best_col = ordered_locations[0] if ordered_locations else -1
        for col in ordered_locations:
            current_root_col = col if max_depth == depth else root_col
            node_id = f"N_{depth}_{col}_{random.randint(0,9999)}"
            
            if capture_tree:
                tree_edges.append(f"{parent_id} -->|C{col+1}| {node_id}")

            b_copy = board.copy()
            drop_piece(b_copy, get_next_open_row(board, col), col, AI)
            new_score = minimax_ab(b_copy, depth-1, alpha, beta, False, use_pruning, max_depth, node_id, current_root_col)[1]
            
            if capture_tree: tree_edges.append(f"{node_id}:::aiNode")
            
            if new_score > value:
                value = new_score
                best_col = col
                
            if use_pruning:
                alpha = max(alpha, value)
                if alpha >= beta:
                    if current_root_col is not None: pruned_columns_in_search.add(current_root_col)
                    if capture_tree:
                        tree_edges.append(f"{node_id} -.->|Pruned| P_{node_id}[✂️ Cut]")
                        tree_edges.append(f"class P_{node_id} prunedNode")
                    break
        return best_col, value
    else:
        value = math.inf
        best_col = ordered_locations[0] if ordered_locations else -1
        for col in ordered_locations:
            current_root_col = col if max_depth == depth else root_col
            node_id = f"N_{depth}_{col}_{random.randint(0,9999)}"
            
            if capture_tree:
                tree_edges.append(f"{parent_id} -->|C{col+1}| {node_id}")

            b_copy = board.copy()
            drop_piece(b_copy, get_next_open_row(board, col), col, PLAYER)
            new_score = minimax_ab(b_copy, depth-1, alpha, beta, True, use_pruning, max_depth, node_id, current_root_col)[1]
            
            if capture_tree: tree_edges.append(f"{node_id}:::playerNode")

            if new_score < value:
                value = new_score
                best_col = col
                
            if use_pruning:
                beta = min(beta, value)
                if alpha >= beta:
                    if current_root_col is not None: pruned_columns_in_search.add(current_root_col)
                    if capture_tree:
                        tree_edges.append(f"{node_id} -.->|Pruned| P_{node_id}[✂️ Cut]")
                        tree_edges.append(f"class P_{node_id} prunedNode")
                    break
        return best_col, value