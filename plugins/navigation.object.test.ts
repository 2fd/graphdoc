import projectPackage from "../test/empty.package.json";
import NavigationObject from "./navigation.object";
import schema from "../test/github.json";

describe("pĺugins/navigation.directive#NavigationDirectives", () => {
  test("plugin return empty", () => {
    const plugin = new NavigationObject(
      {
        ...schema.data.__schema,
        types: [],
      },
      projectPackage,
      {}
    );

    expect(plugin.getNavigations("Query")).toEqual([]);
  });

  test("plugin return navigation", () => {
    const plugin = new NavigationObject(
      schema.data.__schema,
      projectPackage,
      {}
    );
    expect(plugin.getNavigations("Query")).toEqual([
      {
        title: "Objects",
        items: [
          {
            href: "/addcommentpayload.doc.html",
            isActive: false,
            text: "AddCommentPayload",
          },
          {
            href: "/addprojectcardpayload.doc.html",
            isActive: false,
            text: "AddProjectCardPayload",
          },
          {
            href: "/addprojectcolumnpayload.doc.html",
            isActive: false,
            text: "AddProjectColumnPayload",
          },
          {
            href: "/addpullrequestreviewcommentpayload.doc.html",
            isActive: false,
            text: "AddPullRequestReviewCommentPayload",
          },
          {
            href: "/addpullrequestreviewpayload.doc.html",
            isActive: false,
            text: "AddPullRequestReviewPayload",
          },
          {
            href: "/addreactionpayload.doc.html",
            isActive: false,
            text: "AddReactionPayload",
          },
          {
            href: "/assignedevent.doc.html",
            isActive: false,
            text: "AssignedEvent",
          },
          {
            href: "/baserefforcepushedevent.doc.html",
            isActive: false,
            text: "BaseRefForcePushedEvent",
          },
          {
            href: "/blame.doc.html",
            isActive: false,
            text: "Blame",
          },
          {
            href: "/blamerange.doc.html",
            isActive: false,
            text: "BlameRange",
          },
          {
            href: "/blob.doc.html",
            isActive: false,
            text: "Blob",
          },
          {
            href: "/bot.doc.html",
            isActive: false,
            text: "Bot",
          },
          {
            href: "/closedevent.doc.html",
            isActive: false,
            text: "ClosedEvent",
          },
          {
            href: "/commit.doc.html",
            isActive: false,
            text: "Commit",
          },
          {
            href: "/commitcomment.doc.html",
            isActive: false,
            text: "CommitComment",
          },
          {
            href: "/commitcommentconnection.doc.html",
            isActive: false,
            text: "CommitCommentConnection",
          },
          {
            href: "/commitcommentedge.doc.html",
            isActive: false,
            text: "CommitCommentEdge",
          },
          {
            href: "/commitconnection.doc.html",
            isActive: false,
            text: "CommitConnection",
          },
          {
            href: "/commitedge.doc.html",
            isActive: false,
            text: "CommitEdge",
          },
          {
            href: "/commithistoryconnection.doc.html",
            isActive: false,
            text: "CommitHistoryConnection",
          },
          {
            href: "/createprojectpayload.doc.html",
            isActive: false,
            text: "CreateProjectPayload",
          },
          {
            href: "/deleteprojectcardpayload.doc.html",
            isActive: false,
            text: "DeleteProjectCardPayload",
          },
          {
            href: "/deleteprojectcolumnpayload.doc.html",
            isActive: false,
            text: "DeleteProjectColumnPayload",
          },
          {
            href: "/deleteprojectpayload.doc.html",
            isActive: false,
            text: "DeleteProjectPayload",
          },
          {
            href: "/deletepullrequestreviewpayload.doc.html",
            isActive: false,
            text: "DeletePullRequestReviewPayload",
          },
          {
            href: "/demilestonedevent.doc.html",
            isActive: false,
            text: "DemilestonedEvent",
          },
          {
            href: "/deployedevent.doc.html",
            isActive: false,
            text: "DeployedEvent",
          },
          {
            href: "/deployment.doc.html",
            isActive: false,
            text: "Deployment",
          },
          {
            href: "/deploymentstatus.doc.html",
            isActive: false,
            text: "DeploymentStatus",
          },
          {
            href: "/deploymentstatusconnection.doc.html",
            isActive: false,
            text: "DeploymentStatusConnection",
          },
          {
            href: "/deploymentstatusedge.doc.html",
            isActive: false,
            text: "DeploymentStatusEdge",
          },
          {
            href: "/dismisspullrequestreviewpayload.doc.html",
            isActive: false,
            text: "DismissPullRequestReviewPayload",
          },
          {
            href: "/followerconnection.doc.html",
            isActive: false,
            text: "FollowerConnection",
          },
          {
            href: "/followingconnection.doc.html",
            isActive: false,
            text: "FollowingConnection",
          },
          {
            href: "/gist.doc.html",
            isActive: false,
            text: "Gist",
          },
          {
            href: "/gistcomment.doc.html",
            isActive: false,
            text: "GistComment",
          },
          {
            href: "/gistconnection.doc.html",
            isActive: false,
            text: "GistConnection",
          },
          {
            href: "/gistedge.doc.html",
            isActive: false,
            text: "GistEdge",
          },
          {
            href: "/gitactor.doc.html",
            isActive: false,
            text: "GitActor",
          },
          {
            href: "/gpgsignature.doc.html",
            isActive: false,
            text: "GpgSignature",
          },
          {
            href: "/headrefdeletedevent.doc.html",
            isActive: false,
            text: "HeadRefDeletedEvent",
          },
          {
            href: "/headrefforcepushedevent.doc.html",
            isActive: false,
            text: "HeadRefForcePushedEvent",
          },
          {
            href: "/headrefrestoredevent.doc.html",
            isActive: false,
            text: "HeadRefRestoredEvent",
          },
          {
            href: "/issue.doc.html",
            isActive: false,
            text: "Issue",
          },
          {
            href: "/issuecomment.doc.html",
            isActive: false,
            text: "IssueComment",
          },
          {
            href: "/issuecommentconnection.doc.html",
            isActive: false,
            text: "IssueCommentConnection",
          },
          {
            href: "/issuecommentedge.doc.html",
            isActive: false,
            text: "IssueCommentEdge",
          },
          {
            href: "/issueconnection.doc.html",
            isActive: false,
            text: "IssueConnection",
          },
          {
            href: "/issueedge.doc.html",
            isActive: false,
            text: "IssueEdge",
          },
          {
            href: "/issuetimelineconnection.doc.html",
            isActive: false,
            text: "IssueTimelineConnection",
          },
          {
            href: "/issuetimelineitemedge.doc.html",
            isActive: false,
            text: "IssueTimelineItemEdge",
          },
          {
            href: "/label.doc.html",
            isActive: false,
            text: "Label",
          },
          {
            href: "/labelconnection.doc.html",
            isActive: false,
            text: "LabelConnection",
          },
          {
            href: "/labeledevent.doc.html",
            isActive: false,
            text: "LabeledEvent",
          },
          {
            href: "/labeledge.doc.html",
            isActive: false,
            text: "LabelEdge",
          },
          {
            href: "/language.doc.html",
            isActive: false,
            text: "Language",
          },
          {
            href: "/languageconnection.doc.html",
            isActive: false,
            text: "LanguageConnection",
          },
          {
            href: "/languageedge.doc.html",
            isActive: false,
            text: "LanguageEdge",
          },
          {
            href: "/lockedevent.doc.html",
            isActive: false,
            text: "LockedEvent",
          },
          {
            href: "/mentionedevent.doc.html",
            isActive: false,
            text: "MentionedEvent",
          },
          {
            href: "/mergedevent.doc.html",
            isActive: false,
            text: "MergedEvent",
          },
          {
            href: "/milestone.doc.html",
            isActive: false,
            text: "Milestone",
          },
          {
            href: "/milestoneconnection.doc.html",
            isActive: false,
            text: "MilestoneConnection",
          },
          {
            href: "/milestonedevent.doc.html",
            isActive: false,
            text: "MilestonedEvent",
          },
          {
            href: "/milestoneedge.doc.html",
            isActive: false,
            text: "MilestoneEdge",
          },
          {
            href: "/moveprojectcardpayload.doc.html",
            isActive: false,
            text: "MoveProjectCardPayload",
          },
          {
            href: "/moveprojectcolumnpayload.doc.html",
            isActive: false,
            text: "MoveProjectColumnPayload",
          },
          {
            href: "/organization.doc.html",
            isActive: false,
            text: "Organization",
          },
          {
            href: "/organizationconnection.doc.html",
            isActive: false,
            text: "OrganizationConnection",
          },
          {
            href: "/organizationedge.doc.html",
            isActive: false,
            text: "OrganizationEdge",
          },
          {
            href: "/organizationinvitation.doc.html",
            isActive: false,
            text: "OrganizationInvitation",
          },
          {
            href: "/organizationinvitationconnection.doc.html",
            isActive: false,
            text: "OrganizationInvitationConnection",
          },
          {
            href: "/organizationinvitationedge.doc.html",
            isActive: false,
            text: "OrganizationInvitationEdge",
          },
          {
            href: "/pageinfo.doc.html",
            isActive: false,
            text: "PageInfo",
          },
          {
            href: "/project.doc.html",
            isActive: false,
            text: "Project",
          },
          {
            href: "/projectcard.doc.html",
            isActive: false,
            text: "ProjectCard",
          },
          {
            href: "/projectcardconnection.doc.html",
            isActive: false,
            text: "ProjectCardConnection",
          },
          {
            href: "/projectcardedge.doc.html",
            isActive: false,
            text: "ProjectCardEdge",
          },
          {
            href: "/projectcolumn.doc.html",
            isActive: false,
            text: "ProjectColumn",
          },
          {
            href: "/projectcolumnconnection.doc.html",
            isActive: false,
            text: "ProjectColumnConnection",
          },
          {
            href: "/projectcolumnedge.doc.html",
            isActive: false,
            text: "ProjectColumnEdge",
          },
          {
            href: "/projectconnection.doc.html",
            isActive: false,
            text: "ProjectConnection",
          },
          {
            href: "/projectedge.doc.html",
            isActive: false,
            text: "ProjectEdge",
          },
          {
            href: "/protectedbranch.doc.html",
            isActive: false,
            text: "ProtectedBranch",
          },
          {
            href: "/protectedbranchconnection.doc.html",
            isActive: false,
            text: "ProtectedBranchConnection",
          },
          {
            href: "/protectedbranchedge.doc.html",
            isActive: false,
            text: "ProtectedBranchEdge",
          },
          {
            href: "/pullrequest.doc.html",
            isActive: false,
            text: "PullRequest",
          },
          {
            href: "/pullrequestconnection.doc.html",
            isActive: false,
            text: "PullRequestConnection",
          },
          {
            href: "/pullrequestedge.doc.html",
            isActive: false,
            text: "PullRequestEdge",
          },
          {
            href: "/pullrequestreview.doc.html",
            isActive: false,
            text: "PullRequestReview",
          },
          {
            href: "/pullrequestreviewcomment.doc.html",
            isActive: false,
            text: "PullRequestReviewComment",
          },
          {
            href: "/pullrequestreviewcommentconnection.doc.html",
            isActive: false,
            text: "PullRequestReviewCommentConnection",
          },
          {
            href: "/pullrequestreviewcommentedge.doc.html",
            isActive: false,
            text: "PullRequestReviewCommentEdge",
          },
          {
            href: "/pullrequestreviewconnection.doc.html",
            isActive: false,
            text: "PullRequestReviewConnection",
          },
          {
            href: "/pullrequestreviewedge.doc.html",
            isActive: false,
            text: "PullRequestReviewEdge",
          },
          {
            href: "/pullrequestreviewthread.doc.html",
            isActive: false,
            text: "PullRequestReviewThread",
          },
          {
            href: "/reactinguserconnection.doc.html",
            isActive: false,
            text: "ReactingUserConnection",
          },
          {
            href: "/reactinguseredge.doc.html",
            isActive: false,
            text: "ReactingUserEdge",
          },
          {
            href: "/reaction.doc.html",
            isActive: false,
            text: "Reaction",
          },
          {
            href: "/reactionconnection.doc.html",
            isActive: false,
            text: "ReactionConnection",
          },
          {
            href: "/reactionedge.doc.html",
            isActive: false,
            text: "ReactionEdge",
          },
          {
            href: "/reactiongroup.doc.html",
            isActive: false,
            text: "ReactionGroup",
          },
          {
            href: "/ref.doc.html",
            isActive: false,
            text: "Ref",
          },
          {
            href: "/refconnection.doc.html",
            isActive: false,
            text: "RefConnection",
          },
          {
            href: "/refedge.doc.html",
            isActive: false,
            text: "RefEdge",
          },
          {
            href: "/referencedevent.doc.html",
            isActive: false,
            text: "ReferencedEvent",
          },
          {
            href: "/release.doc.html",
            isActive: false,
            text: "Release",
          },
          {
            href: "/releaseasset.doc.html",
            isActive: false,
            text: "ReleaseAsset",
          },
          {
            href: "/releaseassetconnection.doc.html",
            isActive: false,
            text: "ReleaseAssetConnection",
          },
          {
            href: "/releaseassetedge.doc.html",
            isActive: false,
            text: "ReleaseAssetEdge",
          },
          {
            href: "/releaseconnection.doc.html",
            isActive: false,
            text: "ReleaseConnection",
          },
          {
            href: "/releaseedge.doc.html",
            isActive: false,
            text: "ReleaseEdge",
          },
          {
            href: "/removeoutsidecollaboratorpayload.doc.html",
            isActive: false,
            text: "RemoveOutsideCollaboratorPayload",
          },
          {
            href: "/removereactionpayload.doc.html",
            isActive: false,
            text: "RemoveReactionPayload",
          },
          {
            href: "/renamedevent.doc.html",
            isActive: false,
            text: "RenamedEvent",
          },
          {
            href: "/reopenedevent.doc.html",
            isActive: false,
            text: "ReopenedEvent",
          },
          {
            href: "/repository.doc.html",
            isActive: false,
            text: "Repository",
          },
          {
            href: "/repositoryconnection.doc.html",
            isActive: false,
            text: "RepositoryConnection",
          },
          {
            href: "/repositoryedge.doc.html",
            isActive: false,
            text: "RepositoryEdge",
          },
          {
            href: "/repositoryinvitation.doc.html",
            isActive: false,
            text: "RepositoryInvitation",
          },
          {
            href: "/repositoryinvitationrepository.doc.html",
            isActive: false,
            text: "RepositoryInvitationRepository",
          },
          {
            href: "/requestreviewspayload.doc.html",
            isActive: false,
            text: "RequestReviewsPayload",
          },
          {
            href: "/reviewdismissalallowance.doc.html",
            isActive: false,
            text: "ReviewDismissalAllowance",
          },
          {
            href: "/reviewdismissalallowanceconnection.doc.html",
            isActive: false,
            text: "ReviewDismissalAllowanceConnection",
          },
          {
            href: "/reviewdismissalallowanceedge.doc.html",
            isActive: false,
            text: "ReviewDismissalAllowanceEdge",
          },
          {
            href: "/reviewdismissedevent.doc.html",
            isActive: false,
            text: "ReviewDismissedEvent",
          },
          {
            href: "/reviewrequest.doc.html",
            isActive: false,
            text: "ReviewRequest",
          },
          {
            href: "/reviewrequestconnection.doc.html",
            isActive: false,
            text: "ReviewRequestConnection",
          },
          {
            href: "/reviewrequestedevent.doc.html",
            isActive: false,
            text: "ReviewRequestedEvent",
          },
          {
            href: "/reviewrequestedge.doc.html",
            isActive: false,
            text: "ReviewRequestEdge",
          },
          {
            href: "/reviewrequestremovedevent.doc.html",
            isActive: false,
            text: "ReviewRequestRemovedEvent",
          },
          {
            href: "/searchresultitemconnection.doc.html",
            isActive: false,
            text: "SearchResultItemConnection",
          },
          {
            href: "/searchresultitemedge.doc.html",
            isActive: false,
            text: "SearchResultItemEdge",
          },
          {
            href: "/smimesignature.doc.html",
            isActive: false,
            text: "SmimeSignature",
          },
          {
            href: "/stargazerconnection.doc.html",
            isActive: false,
            text: "StargazerConnection",
          },
          {
            href: "/stargazeredge.doc.html",
            isActive: false,
            text: "StargazerEdge",
          },
          {
            href: "/starredrepositoryconnection.doc.html",
            isActive: false,
            text: "StarredRepositoryConnection",
          },
          {
            href: "/starredrepositoryedge.doc.html",
            isActive: false,
            text: "StarredRepositoryEdge",
          },
          {
            href: "/status.doc.html",
            isActive: false,
            text: "Status",
          },
          {
            href: "/statuscontext.doc.html",
            isActive: false,
            text: "StatusContext",
          },
          {
            href: "/submitpullrequestreviewpayload.doc.html",
            isActive: false,
            text: "SubmitPullRequestReviewPayload",
          },
          {
            href: "/subscribedevent.doc.html",
            isActive: false,
            text: "SubscribedEvent",
          },
          {
            href: "/tag.doc.html",
            isActive: false,
            text: "Tag",
          },
          {
            href: "/team.doc.html",
            isActive: false,
            text: "Team",
          },
          {
            href: "/teamconnection.doc.html",
            isActive: false,
            text: "TeamConnection",
          },
          {
            href: "/teamedge.doc.html",
            isActive: false,
            text: "TeamEdge",
          },
          {
            href: "/tree.doc.html",
            isActive: false,
            text: "Tree",
          },
          {
            href: "/treeentry.doc.html",
            isActive: false,
            text: "TreeEntry",
          },
          {
            href: "/unassignedevent.doc.html",
            isActive: false,
            text: "UnassignedEvent",
          },
          {
            href: "/unknownsignature.doc.html",
            isActive: false,
            text: "UnknownSignature",
          },
          {
            href: "/unlabeledevent.doc.html",
            isActive: false,
            text: "UnlabeledEvent",
          },
          {
            href: "/unlockedevent.doc.html",
            isActive: false,
            text: "UnlockedEvent",
          },
          {
            href: "/unsubscribedevent.doc.html",
            isActive: false,
            text: "UnsubscribedEvent",
          },
          {
            href: "/updateprojectcardpayload.doc.html",
            isActive: false,
            text: "UpdateProjectCardPayload",
          },
          {
            href: "/updateprojectcolumnpayload.doc.html",
            isActive: false,
            text: "UpdateProjectColumnPayload",
          },
          {
            href: "/updateprojectpayload.doc.html",
            isActive: false,
            text: "UpdateProjectPayload",
          },
          {
            href: "/updatepullrequestreviewcommentpayload.doc.html",
            isActive: false,
            text: "UpdatePullRequestReviewCommentPayload",
          },
          {
            href: "/updatepullrequestreviewpayload.doc.html",
            isActive: false,
            text: "UpdatePullRequestReviewPayload",
          },
          {
            href: "/updatesubscriptionpayload.doc.html",
            isActive: false,
            text: "UpdateSubscriptionPayload",
          },
          {
            href: "/user.doc.html",
            isActive: false,
            text: "User",
          },
          {
            href: "/userconnection.doc.html",
            isActive: false,
            text: "UserConnection",
          },
          {
            href: "/useredge.doc.html",
            isActive: false,
            text: "UserEdge",
          },
          {
            href: "/directive.spec.html",
            isActive: false,
            text: "__Directive",
          },
          {
            href: "/enumvalue.spec.html",
            isActive: false,
            text: "__EnumValue",
          },
          {
            href: "/field.spec.html",
            isActive: false,
            text: "__Field",
          },
          {
            href: "/inputvalue.spec.html",
            isActive: false,
            text: "__InputValue",
          },
          {
            href: "/schema.spec.html",
            isActive: false,
            text: "__Schema",
          },
          {
            href: "/type.spec.html",
            isActive: false,
            text: "__Type",
          },
        ],
      },
    ]);
  });
});
