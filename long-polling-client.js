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

async function Poll() {
    const jobId = await submitJob()
    if (!jobId) return

    console.log('Starting to poll for job status...')
    const status = await checkStatus(jobId)
    console.log(status)
}

// Start the polling process
Poll()