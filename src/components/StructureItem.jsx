import React from "react";
import {
  FiFolder,
  FiFile,
  FiChevronRight,
  FiChevronDown,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { FaMessage } from "react-icons/fa6";

const StructureItem = ({
  item,
  depth,
  expandedFolders,
  editingId,
  newName,
  onToggleFolder,
  onSetEditing,
  onSetNewName,
  onAddItem,
  onRename,
  onDelete,
}) => {
  const isExpanded = expandedFolders.has(item.id);
  const isEditing = editingId === item.id;

  return (
    <div className="ml-4">
      <div className="flex items-center justify-between group py-1">
        <div className="flex items-center gap-2">
          {item.isFolder && (
            <button
              onClick={() => onToggleFolder(item.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
            </button>
          )}

          {item.isFolder ? (
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                className="fill-purple-900"
              />

              <path
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                className="fill-purple-800"
                transform="translate(0.5 0.5)"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-400 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
            </svg>
          )}

          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => onSetNewName(e.target.value)}
              className="border rounded px-2 py-1 ml-2"
              autoFocus
            />
          ) : (
            <span className="ml-2 text-gray-800">{item.name}</span>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <button
              onClick={() => onRename(item.id)}
              className="text-green-600 hover:text-green-800"
            >
              Save
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onSetEditing(item.id);
                  onSetNewName(item.name);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 />
              </button>
            </>
          )}
          {item.isFolder && (
            <div className="flex gap-2">
              <button
                onClick={() => onAddItem(item.id, true)}
                className="text-purple-600 hover:text-purple-800"
              >
                <FiPlus />
              </button>
              <button
                onClick={() => onAddItem(item.id, false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiFile className="inline-block" />
              </button>
            </div>
          )}
        </div>
      </div>

      {item.isFolder &&
        isExpanded &&
        item.items?.map((child) => (
          <StructureItem
            key={child.id}
            item={child}
            depth={depth + 1}
            expandedFolders={expandedFolders}
            editingId={editingId}
            newName={newName}
            onToggleFolder={onToggleFolder}
            onSetEditing={onSetEditing}
            onSetNewName={onSetNewName}
            onAddItem={onAddItem}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
};

export default StructureItem;
