import * as ConfigModule from '../config/config';
import { Config } from '../config/interfaces';
import * as GetTeamMembersModule from '../datasaur/get-team-members';
import { validateAssignment } from './validate-assignments';

describe(validateAssignment.name, () => {
  const dummyMembers: Array<GetTeamMembersModule.TeamMember> = [
    { id: '1', user: { email: 'dummy-email' }, invitationEmail: null, invitationStatus: 'ACCEPTED' },
    { id: '2', user: null, invitationEmail: 'dummy-email-pending', invitationStatus: 'SENT' },
  ];

  beforeEach(() => {
    jest.spyOn(GetTeamMembersModule, 'getTeamMembers').mockResolvedValue(dummyMembers);
    jest
      .spyOn(ConfigModule, 'getConfig')
      .mockName('mockGetConfig')
      .mockImplementation(() => {
        return { create: { teamId: 'dummy-teamId' } } as Config;
      });
  });

  it.each([
    [
      'when no assignment are set',
      {
        assignee: {
          labelers: [],
          reviewers: [],
        },
      },
    ],
    ['when no labelers, reviewers in team', { assignee: { labelers: [], reviewers: getEmail(dummyMembers) } }],
    ['when labelers in team, no reviewers', { assignee: { labelers: getEmail(dummyMembers), reviewers: [] } }],
    [
      'when both labelers and reviewers in team',
      { assignee: { labelers: getEmail(dummyMembers), reviewers: getEmail(dummyMembers) } },
    ],
  ])('shoud pass when %s', (_desc, { assignee }) => {
    return expect(validateAssignment(assignee)).resolves.not.toThrow();
  });

  it.each([
    [
      'when labelers not in team',
      {
        assignees: {
          labelers: ['not-in-team', ...getEmail(dummyMembers)],
          reviewers: getEmail(dummyMembers),
        },
      },
    ],
    [
      'when reviewers not in team',
      {
        assignees: {
          labelers: getEmail(dummyMembers),
          reviewers: [...getEmail(dummyMembers), 'not-in-team'],
        },
      },
    ],
  ])('should throw error %s', (_desc, { assignees }) => {
    return expect(validateAssignment(assignees)).rejects.toThrow();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});

function getEmail(members: GetTeamMembersModule.TeamMember[]) {
  return members.map((m) => m.invitationEmail ?? m.user?.email) as string[];
}
