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

app.get('/checkstatus', async(req, res) => {
    const jobId = req.query.jobid
    console.log(jobs[jobId] + ' %')
    // long polling
    while (await checkJobStatus(jobId) == false);
    res.end(`Job Status: completed ${jobs[jobId]} \n\n`)
})

async function checkJobStatus(jobId) {
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
