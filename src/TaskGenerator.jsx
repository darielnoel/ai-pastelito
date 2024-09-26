import { useState } from 'react'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Access the API key from environment variables
  dangerouslyAllowBrowser: true, // Allow browser usage
})

function TaskGenerator() {
  const [ticketText, setTicketText] = useState('')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false) // State to track loading status

  const handleGenerateTasks = async () => {
    setLoading(true) // Set loading to true when the API call starts
    try {
      let completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          {
            role: 'user',
            content: `Generate a list of tasks based on the following ticket text: ${ticketText}. Please provide a JSON array with the tasks. Tasks should have a title, description, status, and priority.`,
          },
        ],
        response_format: { type: "json_object" } // Ensure response is in JSON format
      })

      let generatedTasks
      try {
        generatedTasks = JSON.parse(completion.choices[0].message.content).tasks
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }

      setTasks(generatedTasks)
    } catch (error) {
      console.error('Error generating tasks:', error)
    } finally {
      setLoading(false) // Set loading to false when the API call ends
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <textarea
        value={ticketText}
        onChange={(e) => setTicketText(e.target.value)}
        placeholder="Enter Trello or Jira ticket text"
        style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button
        onClick={handleGenerateTasks}
        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}
        disabled={loading} // Disable the button while loading
      >
        {loading ? 'Generating Tasks...' : 'Generate Tasks'} {/* Show loading text */}
      </button>
      <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
        {tasks.map((task, index) => (
          <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" style={{ marginRight: '10px' }} />
            <div>
              <h3 style={{ margin: '0 0 10px 0' }}>{task.title}</h3>
              {/* <p style={{ margin: '0 0 5px 0' }}>{task.description}</p>
              <p style={{ margin: '0' }}><strong>Status:</strong> {task.status || 'TODO'}</p> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskGenerator
