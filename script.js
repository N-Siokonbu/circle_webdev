// Websocketの実装
const socket = new WebSocket('ws://localhost:8080');
const updateButton = document.getElementById('update-button');
const toggleStatusButton = document.getElementById('button-color');
const jsonDataElement = document.getElementById('json-data');
let currentStatus = false; // 初期値
const button_data = document.querySelectorAll(".draggable-button");

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".draggable-button").forEach((button, index) => {
        console.log(button)
        const dragHandle = button.querySelector(".drag-handle");
        let offsetX, offsetY, isDragging = false, moved = false;

        // 位置をlocalStorageから復元
        const savedPosition = localStorage.getItem(`button-${index}`);
        if (savedPosition) {
            const { left, top } = JSON.parse(savedPosition);
            button.style.left = `${left}px`;
            button.style.top = `${top}px`;
        }

        // クリック時の動作（ドラッグしていない場合のみ）
        button.addEventListener("click", () => {
            if (!isDragging && !moved) {
                alert(`${button.innerText} がクリックされました！`);

                currentStatus = !currentStatus; // true ⇔ false の切り替え
                // ステータス変更をサーバーに送信
                const updatePayload = {
                type: 'updateStatus',
                status: currentStatus,
                };
                socket.send(JSON.stringify(updatePayload));
                console.log("成功しました！")

                // LocalStorageにstatusを保存
                let status_log = updatePayload.status;
                localStorage.setItem(currentStatus, status_log);
            }
            moved = false;
        });

        // サーバーからのメッセージを受信
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            jsonDataElement.textContent = JSON.stringify(data, null, 2); // JSONデータを表示
            currentStatus = data.status;
            button_name = index;

            if(data.status === true){
                for(let i = 0; i < 3; i++) {
                    button_data[a].style.backgroundColor = "gold";
                }
            } else {
                for(let i = 0; i < 3; i++) {
                    button_data[i].style.backgroundColor = "#007BFF";
                }
            }
        };

        // ドラッグ開始
        dragHandle.addEventListener("mousedown", (e) => {
            isDragging = true;
            moved = false;
            offsetX = e.clientX - button.offsetLeft;
            offsetY = e.clientY - button.offsetTop;
            dragHandle.style.cursor = "grabbing";
            e.stopPropagation();
        });

        // ドラッグ中の動作
        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            moved = true;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
        });

        // ドラッグ終了＆位置を保存
        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = "grab";

                // 位置を保存
                localStorage.setItem(`button-${index}`, JSON.stringify({
                    left: button.offsetLeft,
                    top: button.offsetTop
                }));
            }
        });
    });
});

    // WebSocketエラー処理
    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    // WebSocket接続が切れた場合の処理
    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };