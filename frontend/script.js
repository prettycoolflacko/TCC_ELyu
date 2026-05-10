const API = "http://localhost:3000/notes";

let editId = null;
let selectedNote = null;

function openAddModal() {
    editId = null;
    clearForm();
    document.getElementById("modalTitle").textContent = "Add Note";
    document.getElementById("noteModal").classList.add("show");
    document.getElementById("cancelBtn").style.display = "inline";
}

function closeModal() {
    document.getElementById("noteModal").classList.remove("show");
}

function openViewModal(note) {
    selectedNote = note;
    document.getElementById("viewTitle").textContent = note.judul || "Untitled";
    document.getElementById("viewBody").textContent = note.isi || "";
    document.getElementById("viewDate").textContent = new Date(note.tanggal_dibuat).toLocaleString();
    document.getElementById("viewModal").classList.add("show");
}

function closeViewModal() {
    document.getElementById("viewModal").classList.remove("show");
}

function closeModalFromBackdrop(event, modalId) {
    if (event.target.id !== modalId) {
        return;
    }

    if (modalId === "noteModal") {
        cancelEdit();
    } else if (modalId === "viewModal") {
        closeViewModal();
    }
}

async function fetchNotes() {
    const res = await fetch(API);
    const data = await res.json();

    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `<div class="empty">No notes yet... kinda lonely here.</div>`;
        return;
    }

    data.forEach(n => {
        const note = {
            id: n.id,
            judul: n.judul,
            isi: n.isi,
            tanggal_dibuat: n.tanggal_dibuat
        };

        const div = document.createElement("div");
        div.className = "note-preview";
        div.setAttribute("role", "button");
        div.setAttribute("tabindex", "0");

        div.innerHTML = `
            <h3>${escapeHtml(n.judul || "Untitled")}</h3>
            <p>${escapeHtml(getPreviewText(n.isi || ""))}</p>
            <small>${new Date(n.tanggal_dibuat).toLocaleDateString()}</small>
        `;

        div.addEventListener("click", () => openViewModal(note));
        div.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openViewModal(note);
            }
        });

        container.appendChild(div);
    });
}

async function saveNote() {
    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;

    if (!judul || !isi) {
        alert("Isi semua field dulu");
        return;
    }

    if (editId === null) {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judul, isi })
        });
    } else {
        await fetch(`${API}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judul, isi })
        });

        editId = null;
        document.getElementById("cancelBtn").style.display = "inline";
    }

    clearForm();
    closeModal();
    fetchNotes();
}

async function deleteNote(id) {
    if (!confirm("Hapus catatan ini?")) return false;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchNotes();
    return true;
}

function editNote(id, judul, isi) {
    document.getElementById("modalTitle").textContent = "Edit Note";
    document.getElementById("noteModal").classList.add("show");
    document.getElementById("judul").value = judul;
    document.getElementById("isi").value = isi;

    editId = id;
    document.getElementById("cancelBtn").style.display = "inline";
}

function cancelEdit() {
    editId = null;
    clearForm();
    document.getElementById("cancelBtn").style.display = "inline";
    closeModal();
}

async function deleteSelectedNote() {
    if (!selectedNote) return;

    const deleted = await deleteNote(selectedNote.id);
    if (deleted) {
        closeViewModal();
        selectedNote = null;
    }
}

function startEditFromView() {
    if (!selectedNote) return;

    closeViewModal();
    editNote(selectedNote.id, selectedNote.judul, selectedNote.isi);
}

function clearForm() {
    document.getElementById("judul").value = "";
    document.getElementById("isi").value = "";
}

function getPreviewText(text) {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= 110) return normalized;
    return `${normalized.slice(0, 107)}...`;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#39;")
        .replace(/"/g, "&quot;");
}

fetchNotes();