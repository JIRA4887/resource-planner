import React, { useState } from 'https://esm.sh/react';
import ReactDOM from 'https://esm.sh/react-dom/client';

const ResourcePlanningApp = () => {
    const [resources, setResources] = useState([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ]);

    const [projects, setProjects] = useState([
        { id: 1, name: 'Project X' },
        { id: 2, name: 'Project Y' }
    ]);

    const [allocations, setAllocations] = useState([
        { resourceId: 1, projectId: 1, hours: 20, date: '2024-03-11' },
        { resourceId: 2, projectId: 2, hours: 30, date: '2024-03-11' }
    ]);

    const [leaves, setLeaves] = useState([
        { resourceId: 1, date: '2024-03-12' }
    ]);

    const [newAllocation, setNewAllocation] = useState({
        resourceId: '',
        projectId: '',
        hours: '',
        date: ''
    });

    const handleAddAllocation = () => {
        if (!newAllocation.resourceId || !newAllocation.projectId || !newAllocation.hours || !newAllocation.date) {
            alert("Please fill all fields before adding an allocation.");
            return;
        }

        setAllocations([...allocations, { 
            ...newAllocation, 
            resourceId: parseInt(newAllocation.resourceId, 10), 
            projectId: parseInt(newAllocation.projectId, 10),
            hours: parseInt(newAllocation.hours, 10)
        }]);

        setNewAllocation({ resourceId: '', projectId: '', hours: '', date: '' });
    };

    const getMonday = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDay();
        const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(newDate.setDate(diff)).toISOString().split('T')[0];
    };

    const hasLeave = (resourceId, date) => {
        return leaves.some(leave => leave.resourceId === resourceId && leave.date === date);
    };

    return React.createElement('div', null, 
        React.createElement('h2', null, 'Resource Planning'),
        React.createElement('div', null,
            React.createElement('h3', null, 'Add Allocation'),
            React.createElement('select', { 
                value: newAllocation.resourceId, 
                onChange: e => setNewAllocation({ ...newAllocation, resourceId: e.target.value }) 
            },
                React.createElement('option', { value: '' }, 'Select Resource'),
                ...resources.map(res => React.createElement('option', { key: res.id, value: res.id }, res.name))
            ),
            React.createElement('select', { 
                value: newAllocation.projectId, 
                onChange: e => setNewAllocation({ ...newAllocation, projectId: e.target.value }) 
            },
                React.createElement('option', { value: '' }, 'Select Project'),
                ...projects.map(proj => React.createElement('option', { key: proj.id, value: proj.id }, proj.name))
            ),
            React.createElement('input', { 
                type: 'number', 
                placeholder: 'Hours', 
                value: newAllocation.hours, 
                onChange: e => setNewAllocation({ ...newAllocation, hours: e.target.value }) 
            }),
            React.createElement('input', { 
                type: 'date', 
                value: newAllocation.date, 
                onChange: e => setNewAllocation({ ...newAllocation, date: e.target.value }) 
            }),
            React.createElement('button', { onClick: handleAddAllocation }, 'Add')
        ),
        React.createElement('h3', null, 'Allocations'),
        React.createElement('table', { border: "1" },
            React.createElement('thead', null,
                React.createElement('tr', null,
                    ['Resource', 'Project', 'Hours', 'Date', 'Week Start', 'Leave'].map(header => 
                        React.createElement('th', { key: header }, header)
                    )
                )
            ),
            React.createElement('tbody', null,
                allocations.map((alloc, index) => {
                    const leave = hasLeave(alloc.resourceId, alloc.date);
                    return React.createElement('tr', { key: index },
                        React.createElement('td', null, resources.find(res => res.id === alloc.resourceId)?.name || 'Unknown'),
                        React.createElement('td', null, projects.find(proj => proj.id === alloc.projectId)?.name || 'Unknown'),
                        React.createElement('td', null, alloc.hours),
                        React.createElement('td', null, alloc.date),
                        React.createElement('td', null, getMonday(alloc.date)),
                        React.createElement('td', null, leave ? 'On Leave' : 'Available')
                    );
                })
            )
        )
    );
};

// Mount React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ResourcePlanningApp));
