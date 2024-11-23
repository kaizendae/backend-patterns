const app = require('express')()
const jobs = []

// short polling is a technique mainly characterized by the client making requests to the server at regular intervals to check for updates
// the server will respond with the current status of the job
// in this example we will simulate a job that takes 50 seconds to complete
// the client will send a POST request to /submit to start the job

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

app.get('/checkstatus', (req, res) => {
    const jobId = req.query.jobid
    console.log(jobs[jobId])
    if (jobId in jobs) {
        res.end(`Job Status: ${jobs[jobId]} \n\n`)
    } else {
        res.end('Job not found')
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})


