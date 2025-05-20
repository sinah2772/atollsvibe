import React from 'react';
import ActionButtons from './ui/ActionButtons';

const ExampleUsage: React.FC = () => {
  const handleAdd = () => {
    console.log('Add clicked');
  };

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  return (
    <div className="p-4 space-y-8">
      {/* All buttons */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Actions</h2>
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Individual buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Individual Actions</h2>
        <ActionButtons onAdd={handleAdd} />
        <ActionButtons onEdit={handleEdit} />
        <ActionButtons onDelete={handleDelete} />
      </div>

      {/* Custom labels */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Custom Labels</h2>
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addLabel="Create New"
          editLabel="Modify"
          deleteLabel="Remove"
        />
      </div>

      {/* Different alignments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Different Alignments</h2>
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          align="left"
        />
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          align="center"
        />
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          align="right"
        />
      </div>

      {/* Different spacings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Different Spacings</h2>
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          spacing="tight"
        />
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          spacing="normal"
        />
        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          spacing="wide"
        />
      </div>
    </div>
  );
};

export default ExampleUsage;