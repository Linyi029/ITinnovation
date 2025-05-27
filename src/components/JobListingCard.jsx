import React, { useState } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { bidForJob, bidPassStatus } from '../services/blockchain'
import { toast } from 'react-toastify'
import { useGlobalState } from '../store'
import { useNavigate } from 'react-router-dom'

const JobListingCard = ({ jobListing }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [userPassed] = useGlobalState('hasUserPassed')
const [anyonePassed] = useGlobalState('hasAnyonePassed')

  const [answer, setAnswer] = useState('')
  const navigate = useNavigate()

  const hasBidBefore = jobListing.bidders.includes(connectedAccount)
  const isOwner     = connectedAccount === jobListing.owner

  const refreshStatus = async () => {
    await bidPassStatus(jobListing.id)
    // bidStatus 会更新全局 hasUserPassed, hasAnyonePassed
  }

  const handleBidding = async (id) => {
    if (!answer) {
      toast.error('Please enter your answer!')
      return
    }
    await toast.promise(
      (async () => {
        await bidForJob(id, answer)
        await refreshStatus()
        return Promise.resolve()
      })(),
      {
        pending: 'Approve transaction...',
        success: 'Application successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const manageAdminTasks = () => {
    navigate('/myprojects')
  }

  const renderAction = () => {
    // 1. Owner 管理
    if (isOwner) {
      return (
        <button
          onClick={manageAdminTasks}
          className="mt-5 text-sm bg-green-400 px-3 py-2 rounded-sm text-white"
        >
          Manage
        </button>
      )
    }

    // 2. 用户已通过
    if (hasBidBefore && userPassed) {
      return (
        <>
          <button
            disabled
            className="mt-5 text-sm bg-blue-200 px-3 py-2 rounded-sm text-blue-800"
          >
            You answered!
          </button>
          <p className="mt-2 text-sm text-gray-700">{answer}</p>
        </>
      )
    }

    // 3. 用户已投但未通过
    if (hasBidBefore && !userPassed) {
      return (
        <button
          disabled
          className="mt-5 text-sm bg-yellow-200 px-3 py-2 rounded-sm text-yellow-800"
        >
          Your request is pending
        </button>
      )
    }

    // 4. 未投但有人已通过
    if (!hasBidBefore && anyonePassed) {
      return (
        <button
          disabled
          className="mt-5 text-sm bg-red-200 px-3 py-2 rounded-sm text-red-800"
        >
          Someone else already solved
        </button>
      )
    }

    // 5. 未投且没人通过 → 显示投标表单
    return (
      <>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
          placeholder="Enter your answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button
          onClick={() => handleBidding(jobListing.id)}
          className="bg-green-500 px-3 py-1 text-sm text-white rounded-md mt-3"
        >
          Place Bid
        </button>
      </>
    )
  }

  return (
    <div className="border-b border-l border-r border-gray-300 py-6 px-5">
      <h4>{jobListing.jobTitle}</h4>
      <div className="flex mt-2 items-center">
        <FaEthereum className="text-md" />
        <span className="text-md ml-2">
          {parseFloat(jobListing.prize).toFixed(2)} ETH
        </span>
      </div>
      <div className="flex items-center mt-3 text-sm flex-wrap gap-2">
        {jobListing.tags.map((tag, i) => (
          <button
            key={i}
            className="px-4 py-1 bg-gray-200 rounded-lg text-xs"
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="pr-7 mt-5 text-sm">{jobListing.description}</p>
      {/* 在用户已通过的情况下可决定是否展示正确答案 */}
      {renderAction()}
    </div>
  )
}

export default JobListingCard
