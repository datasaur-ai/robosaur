import moment from 'moment';
import { calculateDiffInSeconds } from './helpers';
import { HighlightedDictionary, ReportDictionary, RowAnalyticEvent, RowAnalyticEventType } from './interfaces';
import { ProjectCollection } from './project-collection';

export class ReportBuilder {
  private reportDictionary: ReportDictionary = {};
  private highlightedDictionary: HighlightedDictionary = {};

  constructor(private projectCollection: ProjectCollection) {}

  getReport() {
    return this.reportDictionary;
  }

  processEvent(event: RowAnalyticEvent) {
    const eventCreatedAtInSeconds = parseInt(event.createdAt) / 1000;
    const projectId = event.cell.document.project.id;
    const projectCompletedDateString: string | undefined = this.projectCollection.getProjectCompletedDate(projectId);

    if (!this.projectCollection.isProjectExist(projectId)) {
      return;
    }

    if (
      projectCompletedDateString &&
      moment.unix(eventCreatedAtInSeconds).diff(moment(projectCompletedDateString)) > 0
    ) {
      return;
    }

    switch (event.event) {
      case RowAnalyticEventType.ROW_HIGHLIGHTED:
        this.processRowHighlightedEvent(event);
        break;
      case RowAnalyticEventType.ROW_BASED_ROW_LABELED:
        this.processRowLabeledEvent(event);
        break;
      default:
        break;
    }
  }

  private processRowHighlightedEvent(event: RowAnalyticEvent) {
    const documentId = event.cell.document.id;
    const line = event.cell.line;
    const userId = event.user.id;

    this.highlightedDictionary[documentId] = {
      ...this.highlightedDictionary[documentId],
      [line]: {
        ...this.highlightedDictionary[documentId]?.[line],
        [userId]: event,
      },
    };
  }

  private processRowLabeledEvent(event: RowAnalyticEvent) {
    this.isHighlightAlreadyExist(event)
      ? this.processRowLabeledEventThatAlreadyHasHighlight(event)
      : this.processRowLabeledEventWithNoExistingHighlight(event);
  }

  private processRowLabeledEventThatAlreadyHasHighlight(event: RowAnalyticEvent) {
    const documentId = event.cell.document.id;
    const line = event.cell.line;
    const userId = event.user.id;

    if (event.event === RowAnalyticEventType.ROW_BASED_ROW_LABELED) {
      if (this.isRowReportAlreadyExist(event)) {
        // @ts-ignore
        this.reportDictionary[documentId][line][userId] = {
          ...this.reportDictionary[documentId][line][userId],
          endDate: event.createdAt,
          duration:
            // @ts-ignore
            this.reportDictionary[documentId][line][userId].duration +
            calculateDiffInSeconds(this.highlightedDictionary[documentId][line][userId]!.createdAt, event.createdAt),
        };
      } else {
        // @ts-ignore
        this.reportDictionary[documentId] = {
          ...this.reportDictionary[documentId],
          [line]: {
            ...this.reportDictionary[documentId]?.[line],
            [userId]: {
              ...this.getRowReport(event),
              startDate: this.highlightedDictionary[documentId][line][userId]!.createdAt,
              endDate: event.createdAt,
              duration: calculateDiffInSeconds(
                this.highlightedDictionary[documentId][line][userId]!.createdAt,
                event.createdAt,
              ),
            },
          },
        };
      }
      // so that it can handle another event that has the same line with the same user
      this.highlightedDictionary[documentId][line][userId] = undefined;
    }
  }

  private processRowLabeledEventWithNoExistingHighlight(event: RowAnalyticEvent) {
    const documentId = event.cell.document.id;
    const line = event.cell.line;
    const userId = event.user.id;

    // labeled without highlight due to debounce, use 1 second as the default duration
    if (event.event === RowAnalyticEventType.ROW_BASED_ROW_LABELED) {
      if (this.isRowReportAlreadyExist(event)) {
        // @ts-ignore
        this.reportDictionary[documentId][line][userId] = {
          ...this.reportDictionary[documentId][line][userId],
          duration: this.reportDictionary[documentId][line][userId]!.duration + 1,
        };
      } else {
        // @ts-ignore
        this.reportDictionary[documentId] = {
          ...this.reportDictionary[documentId],
          [line]: {
            ...this.reportDictionary[documentId]?.[line],
            [userId]: {
              ...this.getRowReport(event),
              startDate: event.createdAt,
              endDate: event.createdAt,
              duration: 1,
            },
          },
        };
      }
    }
  }

  private isHighlightAlreadyExist(event: RowAnalyticEvent) {
    return Boolean(this.highlightedDictionary[event.cell.document.id]?.[event.cell.line]?.[event.user.id]);
  }

  private isRowReportAlreadyExist(event: RowAnalyticEvent) {
    return Boolean(this.reportDictionary[event.cell.document.id]?.[event.cell.line]?.[event.user.id]);
  }

  private getRowReport(event: RowAnalyticEvent) {
    return {
      projectId: event.cell.document.project.id,
      projectName: event.cell.document.project.name,
      fileId: event.cell.document.id,
      fileName: event.cell.document.fileName,
      rowNumber: event.cell.line,
      role: event.user.roleName || 'LABELER',
      projectAssignmentRole: this.projectCollection.getProjectAssignmentRole(
        event.cell.document.project.id,
        event.user.id,
      ),
      teamMember: event.user.email,
    };
  }
}
