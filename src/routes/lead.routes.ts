import { Router } from 'express'
import { getLeads, getLeadById, createLead, updateLeadStatus, leadStats } from '../controllers/lead.controller'
import { authenticate } from '../middleware/authenticate'
import { enforceClientScope } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import { createLeadSchema, updateLeadStatusSchema, leadQuerySchema } from '../validators/lead.validator'

export const leadRouter = Router({ mergeParams: true })

leadRouter.use(authenticate, enforceClientScope)

leadRouter.get('/',               validate(leadQuerySchema, 'query'), getLeads)
leadRouter.post('/',              validate(createLeadSchema), createLead)
leadRouter.get('/stats',          leadStats)
leadRouter.get('/:leadId',        getLeadById)
leadRouter.patch('/:leadId/status', validate(updateLeadStatusSchema), updateLeadStatus)
