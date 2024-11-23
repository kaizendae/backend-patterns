const app = require('express')()
const jobs = []

// Long polling is a technique where the client makes an HTTP request to the server,
// and the server holds the connection open until new data is available.
// This simulates real-time updates without WebSocket.
// In this code, the client keeps checking job status until it's complete (100%)

function updateJob(jobId, status) {
    jobs[jobId] = status
    console.log(`updated job ${jobId} to ${status}`)
    if (status === 100) {
        console.log(`job ${jobId} completed`)
        return
    }
    setTimeout(() => {
        updateJob(jobId, jobs[jobId] + 10)
    }, 5000)
}

app.post('/submit', (req, res) => {
    const jobId = `job:${Date.now()}`
    jobs[jobId] = 0
    updateJob(jobId, 0)
    res.end(`\n\n${jobId}\n\n`)
})

app.get('/checkstatus', async(req, res) => {
    const jobId = req.query.jobid
    console.log(jobs[jobId] + ' % Hoding the connection open')

    // long polling
    // while checkJobStatus is false, keep the connection open
    // when the job is completed, the response will be sent
    while (await checkJobStatus(jobId) == false);
    console.log(jobs[jobId] + ' % Job completed releasing the connection')
    res.end(`Job Status: completed ${jobs[jobId]} \n\n`)
})

async function checkJobStatus(jobId) {
    // this is just a simulation of a job that takes time to complete
    // it keeps checking the status of the job every 1 second until it's 100
    await new Promise((resolve, reject) => {
        if (jobs[jobId] < 100) {
            setTimeout(() => {
                resolve(false)
            }, 1000)
        } else {
            resolve(true)
        }
    })
    return jobs[jobId] === 100
}

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
