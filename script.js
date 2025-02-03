document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".draggable-button").forEach((button, index) => {
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
            }
            moved = false;
        });

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
