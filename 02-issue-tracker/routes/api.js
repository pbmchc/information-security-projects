import * as issueController from '../controllers/issueController.js';
import { createIssuesParamsValidationChain } from '../validators/issuesParamsValidator.js';
import {
  createIssueCreationValidationChain,
  createIssueUpdateValidationChain,
  createIssueDeletionValidationChain,
} from '../validators/issueValidator.js';

export const setupRoutes = (app) => {
  app
    .route('/api/issues/:project')
    .get(createIssuesParamsValidationChain(), issueController.getIssues)
    .post(createIssueCreationValidationChain(), issueController.createIssue)
    .put(createIssueUpdateValidationChain(), issueController.updateIssue)
    .delete(createIssueDeletionValidationChain(), issueController.deleteIssue);
};
