from flask import Flask, render_template, request, jsonify
import numpy as np
import math
import ai_logic

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/move', methods=['POST'])
def ai_move():
    data = request.get_json()
    
    flat_board = data.get('board')
    board = np.array(flat_board).reshape((ai_logic.ROW_COUNT, ai_logic.COLUMN_COUNT))
    
    depth = int(data.get('depth', 4))
    use_pruning = data.get('use_pruning', True)
    
    # Reset semua variabel tracking untuk laporan
    ai_logic.node_count_ab = 0
    ai_logic.node_count_mm = 0
    ai_logic.tree_edges = []
    ai_logic.pruned_columns_in_search = set()
    
    # 1. Jalankan simulasi Minimax murni HANYA untuk menghitung perbandingan node
    # (Dibatasi maksimal depth 6 agar server tidak hang)
    pure_depth = min(depth, 6) 
    ai_logic.count_pure_minimax(board, pure_depth, True)
    
    # 2. Jalankan algoritma utama Alpha-Beta Pruning (Membangun Tree & Mencari Langkah)
    col, score = ai_logic.minimax_ab(board, depth, -math.inf, math.inf, True, use_pruning, depth, "Root", None)
    
    if col is None or col == -1:
        valid_locations = ai_logic.get_valid_locations(board)
        col = int(np.random.choice(valid_locations)) if valid_locations else -1

    # Format Diagram Game Tree menggunakan Mermaid.js syntax
    mermaid_code = "graph TD\nRoot:::rootNode\n" + "\n".join(ai_logic.tree_edges) + "\nclassDef aiNode fill:#ff00fc,stroke:#fff,color:#fff;\nclassDef playerNode fill:#00f3ff,stroke:#fff,color:#000;\nclassDef rootNode fill:#222,stroke:#fff,color:#fff;\nclassDef prunedNode fill:#ff4444,stroke:#fff,color:#fff,stroke-dasharray: 5 5;"

    return jsonify({
        'status': 'success',
        'column': int(col),
        'node_count_ab': ai_logic.node_count_ab,
        'node_count_mm': ai_logic.node_count_mm,
        'pruned_cols': list(ai_logic.pruned_columns_in_search),
        'mermaid_tree': mermaid_code
    })

if __name__ == '__main__':
    app.run(debug=True)