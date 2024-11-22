const app = require('express')()
const jobs = []

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
