// Import React and ReactDOM from a CDN
import React from 'https://esm.sh/react';
import ReactDOM from 'https://esm.sh/react-dom';

const ResourcePlanningApp = () => {
  // State definitions
  const [resources, setResources] = useState([
    { id: 1, name: 'John Doe', role: 'Developer' },
    { id: 2, name: 'Jane Smith', role: 'Designer' },
    { id: 3, name: 'Bob Johnson', role: 'Project Manager' }
  ]);
  
  const [projects, setProjects] = useState([
    { id: 1, name: 'Website Redesign', color: '#3b82f6' },
    { id: 2, name: 'Mobile App Development', color: '#10b981' },
    { id: 3, name: 'Database Migration', color: '#8b5cf6' }
  ]);
  
  const [holidays, setHolidays] = useState([
    { date: '2025-03-17', name: 'St. Patrick\'s Day' },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-05-26', name: 'Memorial Day' }
  ]);
  
  const [leaves, setLeaves] = useState([
    { resourceId: 1, date: '2025-03-12', type: 'Vacation' },
    { resourceId: 2, date: '2025-03-13', type: 'Sick' },
    { resourceId: 3, date: '2025-03-14', type: 'Personal' }
  ]);
  
  const [allocations, setAllocations] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(getMonday(new Date()));
  const [newResource, setNewResource] = useState({ name: '', role: '' });
  const [newProject, setNewProject] = useState({ name: '', color: '#6b7280' });
  const [newLeave, setNewLeave] = useState({ resourceId: '', date: '', type: 'Vacation' });
  const [newAllocation, setNewAllocation] = useState({ resourceId: '', projectId: '', date: '', hours: 8 });

  // Utility functions
  function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  function getWeekDates(startDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 5; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  function isHoliday(date) {
    const dateStr = formatDate(date);
    return holidays.find(holiday => holiday.date === dateStr);
  }

  function hasLeave(resourceId, date) {
    const dateStr = formatDate(date);
    return leaves.find(leave => leave.resourceId === resourceId && leave.date === dateStr);
  }

  function getAllocationsForDay(resourceId, date) {
    const dateStr = formatDate(date);
    return allocations.filter(allocation => 
      allocation.resourceId === resourceId && 
      allocation.date === dateStr
    );
  }

  function getTotalHoursForDay(resourceId, date) {
    const allocs = getAllocationsForDay(resourceId, date);
    return allocs.reduce((total, allocation) => total + allocation.hours, 0);
  }

  // Add handlers
  const handleAddResource = () => {
    if (newResource.name.trim() === '') return;
    const newId = Math.max(0, ...resources.map(r => r.id)) + 1;
    setResources([...resources, { ...newResource, id: newId }]);
    setNewResource({ name: '', role: '' });
  };

  const handleAddProject = () => {
    if (newProject.name.trim() === '') return;
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    setProjects([...projects, { ...newProject, id: newId }]);
    setNewProject({ name: '', color: '#6b7280' });
  };

  const handleAddLeave = () => {
    if (!newLeave.resourceId || !newLeave.date) return;
    setLeaves([...leaves, { ...newLeave }]);
    setNewLeave({ resourceId: '', date: '', type: 'Vacation' });
  };

  const handleAddAllocation = () => {
    if (!newAllocation.resourceId || !newAllocation.projectId || !newAllocation.date || !newAllocation.hours) return;
    const existingIndex = allocations.findIndex(a => 
      a.resourceId === parseInt(newAllocation.resourceId) && 
      a.projectId === parseInt(newAllocation.projectId) && 
      a.date === newAllocation.date
    );
    if (existingIndex >= 0) {
      const updatedAllocations = [...allocations];
      updatedAllocations[existingIndex].hours = parseInt(newAllocation.hours);
      setAllocations(updatedAllocations);
    } else {
      setAllocations([...allocations, { 
        ...newAllocation, 
        resourceId: parseInt(newAllocation.resourceId), 
        projectId: parseInt(newAllocation.projectId),
        hours: parseInt(newAllocation.hours)
      }]);
    }
    setNewAllocation({ resourceId: '', projectId: '', date: '', hours: 8 });
  };

  // Delete handlers
  const handleDeleteResource = (resourceId) => {
    setResources(resources.filter(r => r.id !== resourceId));
    setAllocations(allocations.filter(a => a.resourceId !== resourceId));
    setLeaves(leaves.filter(l => l.resourceId !== resourceId));
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setAllocations(allocations.filter(a => a.projectId !== projectId));
  };

  const handleDeleteHoliday = (date) => {
    setHolidays(holidays.filter(h => h.date !== date));
  };

  const handleDeleteLeave = (index) => {
    setLeaves(leaves.filter((_, i) => i !== index));
  };

  const handleDeleteAllocation = (allocation) => {
    setAllocations(allocations.filter(a => 
      !(a.resourceId === allocation.resourceId &&
        a.projectId === allocation.projectId &&
        a.date === allocation.date)
    ));
  };

  // Project-wise resource deployment view
  const ProjectDeploymentGrid = () => {
    const weekDates = getWeekDates(currentStartDate);
    return (
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '0.5rem' }}>Project</th>
              {weekDates.map((date, index) => (
                <th key={index} style={{ border: '1px solid #d1d5db', padding: '0.5rem' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {isHoliday(date) && <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{isHoliday(date).name}</div>}
                </th>
              ))}
              <th style={{ border: '1px solid #d1d5db', padding: '0.5rem' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td style={{ border: '1px solid #d1d5db', padding: '0.5rem' }}>
                  <div style={{ fontWeight: '500' }}>{project.name}</div>
                  <div style={{ width: '1rem', height: '1rem', borderRadius: '0.25rem', backgroundColor: project.color }}></div>
                </td>
                {weekDates.map((date, index) => {
                  const dateStr = formatDate(date);
                  const projectAllocations = allocations.filter(a => 
                    a.projectId === project.id && 
                    a.date === dateStr
                  );
                  const totalHours = projectAllocations.reduce((sum, a) => sum + a.hours, 0);
                  return (
                    <td key={index} style={{ border: '1px solid #d1d5db', padding: '0.5rem' }}>
                      <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{totalHours} hrs</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                        {projectAllocations.map((allocation, i) => {
                          const resource = resources.find(r => r.id === allocation.resourceId);
                          return (
                            <div key={i} style={{ fontSize: '0.75rem', padding: '0.25rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{resource?.name || 'Unknown'}: {allocation.hours}h</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAllocation(allocation);
                                }} 
                                style={{ color: '#6b7280', marginLeft: '0.25rem', cursor: 'pointer' }}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
                <td style={{ border: '1px solid #d1d5db', padding: '0.5rem', fontWeight: '500' }}>
                  {weekDates.reduce((total, date) => {
                    const dateStr = formatDate(date);
                    return total + allocations.filter(a => 
                      a.projectId === project.id && a.date === dateStr
                    ).reduce((sum, a) => sum + a.hours, 0);
                  }, 0)} hrs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '100%' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Resource Planning Management System</h1>
      
      {/* Week Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={previousWeek} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}>←</button>
        <h2 style={{ margin: '0 1rem', fontSize: '1.125rem', fontWeight: '600' }}>
          Week of {currentStartDate.toLocaleDateString()}
        </h2>
        <button onClick={nextWeek} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}>→</button>
        <button onClick={exportData} style={{ marginLeft: 'auto', padding: '0.25rem 0.75rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.25rem' }}>
          Export Data
        </button>
      </div>

      {/* Project Deployment Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '1rem 0' }}>Project Deployment Overview</h2>
      <ProjectDeploymentGrid />

      {/* Management Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Resources Section */}
        <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Resources</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Name"
                style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
                value={newResource.name}
                onChange={e => setNewResource({ ...newResource, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Role"
                style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
                value={newResource.role}
                onChange={e => setNewResource({ ...newResource, role: e.target.value })}
              />
              <button 
                onClick={handleAddResource}
                style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
              >
                Add
              </button>
            </div>
            <ul style={{ fontSize: '0.875rem' }}>
              {resources.map(resource => (
                <li key={resource.id} style={{ padding: '0.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {resource.name} ({resource.role})
                  </div>
                  <button 
                    onClick={() => handleDeleteResource(resource.id)}
                    style={{ color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Projects Section */}
        <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Projects</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Project Name"
                style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
                value={newProject.name}
                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
              />
              <input
                type="color"
                style={{ border: '1px solid #d1d5db', padding: '0', width: '2.5rem' }}
                value={newProject.color}
                onChange={e => setNewProject({ ...newProject, color: e.target.value })}
              />
              <button 
                onClick={handleAddProject}
                style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
              >
                Add
              </button>
            </div>
            <ul style={{ fontSize: '0.875rem' }}>
              {projects.map(project => (
                <li key={project.id} style={{ padding: '0.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '1rem', height: '1rem', borderRadius: '0.25rem', backgroundColor: project.color }}></div>
                    {project.name}
                  </div>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    style={{ color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Leave Management Section */}
        <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Leave Management</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
                value={newLeave.resourceId}
                onChange={e => setNewLeave({ ...newLeave, resourceId: parseInt(e.target.value) })}
              >
                <option value="">Select Resource</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>{resource.name}</option>
                ))}
              </select>
              <input
                type="date"
                style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
                value={newLeave.date}
                onChange={e => setNewLeave({ ...newLeave, date: e.target.value })}
              />
              <select
                style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
                value={newLeave.type}
                onChange={e => setNewLeave({ ...newLeave, type: e.target.value })}
              >
                <option value="Vacation">Vacation</option>
                <option value="Sick">Sick</option>
                <option value="Personal">Personal</option>
              </select>
              <button 
                onClick={handleAddLeave}
                style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
              >
                Add
              </button>
            </div>
          </div>

          <h3 style={{ fontWeight: '600', margin: '0.5rem 0' }}>Leaves</h3>
          <ul style={{ fontSize: '0.875rem' }}>
            {leaves.map((leave, index) => {
              const resource = resources.find(r => r.id === leave.resourceId);
              return (
                <li key={index} style={{ padding: '0.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    {resource?.name || 'Unknown'} - {leave.date} ({leave.type})
                  </span>
                  <button 
                    onClick={() => handleDeleteLeave(index)}
                    style={{ color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>

          <h3 style={{ fontWeight: '600', margin: '0.5rem 0' }}>Holidays</h3>
          <ul style={{ fontSize: '0.875rem' }}>
            {holidays.map((holiday, index) => (
              <li key={index} style={{ padding: '0.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  {new Date(holiday.date).toLocaleDateString()} - {holiday.name}
                </span>
                <button 
                  onClick={() => handleDeleteHoliday(holiday.date)}
                  style={{ color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Allocation Section */}
        <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Allocate Resources</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                style={{ border: '1px solid #d1d5db', padding: '0.25rem' }}
                value={newAllocation.resourceId}
                onChange={e => setNewAllocation({ ...newAllocation, resourceId: e.target.value })}
              >
                <option value="">Select Resource</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>{resource.name}</option>
                ))}
              </select>
              <select
                style={{ border: '1px solid #d1d5db', padding: '0.25rem' }}
                value={newAllocation.projectId}
                onChange={e => setNewAllocation({ ...newAllocation, projectId: e.target.value })}
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="date"
                  style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
                  value={newAllocation.date}
                  onChange={e => setNewAllocation({ ...newAllocation, date: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Hours"
                  min="1"
                  max="8"
                  style={{ border: '1px solid #d1d5db', padding: '0.25rem', width: '5rem' }}
                  value={newAllocation.hours}
                  onChange={e => setNewAllocation({ ...newAllocation, hours: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleAddAllocation}
                  style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', flex: '1' }}
                >
                  Allocate Hours
                </button>
              </div>
            </div>
          </div>

          <h3 style={{ fontWeight: '600', margin: '0.5rem 0' }}>Auto Allocate for Week</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <select
              id="autoResource"
              style={{ border: '1px solid #d1d5db', padding: '0.25rem' }}
            >
              <option value="">Select Resource</option>
              {resources.map(resource => (
                <option key={resource.id} value={resource.id}>{resource.name}</option>
              ))}
            </select>
            <select
              id="autoProject"
              style={{ border: '1px solid #d1d5db', padding: '0.25rem' }}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                id="autoHours"
                placeholder="Weekly Hours"
                min="1"
                max="40"
                defaultValue="40"
                style={{ border: '1px solid #d1d5db', padding: '0.25rem', flex: '1' }}
              />
              <button 
                onClick={() => {
                  const resourceId = parseInt(document.getElementById('autoResource').value);
                  const projectId = parseInt(document.getElementById('autoProject').value);
                  const hours = parseInt(document.getElementById('autoHours').value);
                  if (resourceId && projectId && hours) {
                    autoDistributeHours(resourceId, projectId, hours);
                  }
                }}
                style={{ backgroundColor: '#10b981', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
              >
                Auto Distribute
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlanningApp;
