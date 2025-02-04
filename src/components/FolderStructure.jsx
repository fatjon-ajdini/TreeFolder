import React, { useState, useEffect } from "react";
import StructureItem from "./StructureItem";
import { FiFolder, FiPlus } from "react-icons/fi";
import initialStructure from "../data/initialStructure";
import ConfirmationDialog from "./ConfirmationDialog";

const FolderStructure = () => {
  const [structure, setStructure] = useState(() => {
    const saved = localStorage.getItem("folder-structure");
    try {
      return saved ? JSON.parse(saved) : initialStructure;
    } catch (error) {
      console.error("Error parsing saved structure:", error);
      return initialStructure;
    }
  });

  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    if (!Array.isArray(structure)) {
      console.error("Invalid structure format, resetting to initial");
      setStructure(initialStructure);
      localStorage.removeItem("folder-structure");
    }
  }, [structure]);

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(folderId) ? next.delete(folderId) : next.add(folderId);
      return next;
    });
  };

  const modifyStructure = (items, targetId, modifier) => {
    return items.map((item) => {
      if (item.id === targetId) {
        return modifier(item);
      }
      if (item.isFolder && item.items) {
        return {
          ...item,
          items: modifyStructure(item.items, targetId, modifier),
        };
      }
      return item;
    });
  };

  const addRootFolder = () => {
    const newFolder = {
      id: `root-${Date.now()}`,
      name: "New Root Folder",
      isFolder: true,
      items: [],
    };
    setStructure((prev) =>
      Array.isArray(prev) ? [...prev, newFolder] : [newFolder]
    );
  };

  const handleAddItem = (parentId, isFolder) => {
    const newItem = {
      id: `${parentId}-${Date.now()}`,
      name: `New ${isFolder ? "Folder" : "File"}`,
      isFolder,
      items: [],
    };

    const addNestedItem = (items) => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            items: item.items ? [...item.items, newItem] : [newItem],
          };
        }
        if (item.items) {
          return {
            ...item,
            items: addNestedItem(item.items),
          };
        }
        return item;
      });
    };

    setStructure((prev) => addNestedItem(prev));
  };

  const handleRename = (id) => {
    setStructure((prev) =>
      modifyStructure(prev, id, (item) => ({
        ...item,
        name: newName,
      }))
    );
    setEditingId(null);
    setNewName("");
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setDialogMessage(
      "Are you sure you want to delete this item? This action cannot be undone."
    );
    setShowDeleteDialog(true);

    const deleteItem = (items) => {
      return items.filter((item) => {
        if (item.id === id) return false;
        if (item.isFolder && item.items) {
          item.items = deleteItem(item.items);
        }
        return true;
      });
    };

    setStructure((prev) => deleteItem(prev));
  };

  const confirmDelete = () => {
    setShowDeleteDialog(false);

    const deleteItem = (items) => {
      return items.filter((item) => {
        if (item.id === deleteTargetId) return false;
        if (item.isFolder && item.items) {
          item.items = deleteItem(item.items);
        }
        return true;
      });
    };

    setStructure((prev) => deleteItem(prev));
    setDeleteTargetId(null);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-black">Responses</h1>
          <button
            onClick={addRootFolder}
            className="text-purple-600 hover:text-purple-800 flex items-center gap-1 bg-transparent border-none"
          >
            <FiPlus className="text-lg" />
            <span>Add</span>
          </button>
        </div>
        {Array.isArray(structure) ? (
          structure.map((rootItem) => (
            <StructureItem
              key={rootItem.id}
              item={rootItem}
              depth={0}
              expandedFolders={expandedFolders}
              editingId={editingId}
              newName={newName}
              onToggleFolder={toggleFolder}
              onSetEditing={setEditingId}
              onSetNewName={setNewName}
              onAddItem={handleAddItem}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-red-500">Invalid data structure</div>
        )}
      </div>
      {showDeleteDialog && (
        <ConfirmationDialog
          title="Confirm Deletion"
          message={dialogMessage}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteDialog(false);
            setDeleteTargetId(null);
          }}
        />
      )}
    </div>
  );
};

export default FolderStructure;
