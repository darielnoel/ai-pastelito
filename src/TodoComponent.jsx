import { useState } from 'react';
import OpenAI from 'openai';

function TodoComponent() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const openai = new OpenAI({
      dangerouslyAllowBrowser: true,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Usar import.meta.env para Vite
    });

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Create a list of tasks based on the following description: ${task}. Please, return the tasks as an array in a JSON format. A task must have title, description, status and priority.` },
        ],
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      const parsedContent = JSON.parse(content);
      const newTasks = parsedContent.tasks;
      setTasks(newTasks); // Replace the existing tasks with new tasks
    } catch (error) {
      console.error('Error fetching completion:', error);
    }

    setLoading(false);
    setTask('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Describe your task"
          required
          style={{ flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'Add Task'}
        </button>
      </form>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {tasks.map((task, index) => (
          <li key={`${index}-${task.title}`} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => {
                const updatedTasks = [...tasks];
                updatedTasks[index].status = updatedTasks[index].status === 'completed' ? 'pending' : 'completed';
                setTasks(updatedTasks);
              }}
              style={{ marginRight: '10px' }}
            />
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoComponent;
