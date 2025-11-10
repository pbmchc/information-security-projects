import { Issue } from '../models/issue.js';
import { assignDateConditions } from '../utils/dateUtils.js';
import { CustomError } from '../utils/errorUtils.js';

const ISSUE_DATE_FIELDS = ['created_on', 'updated_on'];
const ISSUE_DELETE_ERROR = (id) => `Could not delete ${id}`;
const ISSUE_DELETE_SUCCESS = (id) => `Deleted ${id}`;
const ISSUE_SAVE_ERROR = 'Error while saving issue';
const ISSUE_UPDATE_ERROR = (id) => `Could not update ${id}`;
const ISSUE_UPDATE_SUCCESS = (id) => `Successfully updated ${id}`;
const ISSUES_GET_ERROR = 'Error while fetching issues';

export async function createIssue(input) {
  const issue = new Issue(input);

  try {
    const result = await issue.save(input);
    return result;
  } catch {
    throw new CustomError(ISSUE_SAVE_ERROR);
  }
}

export async function updateIssue(input) {
  const { _id } = input;

  try {
    await Issue.updateOne({ _id }, { ...input, updated_on: Date.now() });
    return ISSUE_UPDATE_SUCCESS(_id);
  } catch {
    throw new CustomError(ISSUE_UPDATE_ERROR(_id));
  }
}

export async function deleteIssue(input) {
  const { _id } = input;

  try {
    await Issue.deleteOne(input);
    return ISSUE_DELETE_SUCCESS(_id);
  } catch {
    throw new Error(ISSUE_DELETE_ERROR(_id));
  }
}

export async function getIssues(conditions) {
  ISSUE_DATE_FIELDS.forEach((field) => assignDateConditions(field, conditions));

  const query = Issue.find(conditions);

  try {
    const results = await query.exec();
    return results;
  } catch {
    throw new CustomError(ISSUES_GET_ERROR);
  }
}
