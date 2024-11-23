const axios = require('axios')

async function submitJob() {
    try {
        const response = await axios.post('http://localhost:3000/submit')
        const jobId = response.data.trim()
        console.log('Job submitted:', jobId)
        return jobId
    } catch (error) {
        console.error('Error submitting job:', error.message)
    }
}

async function checkStatus(jobId) {
    try {
        const response = await axios.get(`http://localhost:3000/checkstatus?jobid=${jobId}`)
        return response.data.trim()
    } catch (error) {
        console.error('Error checking status:', error.message)
        return null
    }
}

async function startPolling() {
    const jobId = await submitJob()
    if (!jobId) return

    console.log('Starting to poll for job status...')
    
    const pollInterval = setInterval(async () => {
        const status = await checkStatus(jobId)
        console.log(status)
        
        if (status.includes('100')) {
            console.log('Job completed!')
            clearInterval(pollInterval)
        }
    }, 2000) // Poll every 2 seconds
}

// Start the polling process
startPolling()