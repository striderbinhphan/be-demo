import { TeamModule } from './team.module';

describe('TeamModule', () => {
  it('should create an instance of TeamModule', () => {
    const teamModule = new TeamModule();
    expect(teamModule).toBeInstanceOf(TeamModule);
  });
});
