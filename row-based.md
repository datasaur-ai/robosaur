# Creating `"ROW_BASED"` projects

## `docFileOptions`

We can decide which column to show or hide in web UI by setting the `docFileOptions`.  
There are two properties to set: `"firstRowAsHeader"` and `"customHeaderColumns"`.

```json
{
  "project": {
    "docFileOptions": {
      "firstRowAsHeader": true / false,
      "customHeaderColumns": [
        {
          "name": "column name",
          "displayed": true / false,
          "labelerRestricted": true / false
        }
      ]
    }
  }
}
```

If our CSV has a header row, we can set `firstRowAsHeader` to `true` so Datasaur will not parse them as data.  
`customHeaderColumns` allows us to customize the header row in Datasaur Web UI. Please ensure that you provide the same number of header as the actual data used.

For example, a CSV file like this:

```csv
id,label,color
```

will need 3 headers in `customHeaderColumns` like so:

```json
{
  "customHeaderColumns": [{ "name": "ID" }, { "name": "Label text" }, { "name": "Color" }]
}
```

## Question Sets

Currently, Datasaur supports one question set per project. Each question set can have up to 100 questions in it.

The provided `quickstart.row.json` uses the [question-set.json](quickstart/create/row-based/question-set.json). Inside are a few examples of how we can define our questions.  
Here are a few examples, along with some explanations:

Generally, all questions will have this:

```json
{
  "type": "<type>",
  "config": {},
  "name": "<question name>",
  "label": "<question label>",
  "required": true / false
}
```

1. `TEXT`
   ```json
   {
     "config": {
       "multiline": true / false,
       "pattern": "regex pattern for answer validation"
     }
   }
   ```
   By default, `multiline` is set to false and no regex pattern is provided
2. `SLIDER`
   ```json
   {
     "config": {
       "min": 1,
       "max": 10,
       "step": 1,
       "theme": "SIMPLE" / "GRADIENT"
     }
   }
   ```
   `theme` adjusts the appearance of the slider in Datasaur UI
3. `DROPDOWN`
   ```json
   {
     "config": {
       "multiple": false / true,
       "options": [
         {
           "id": "unique option id",
           "label": "displayed option text"
         }
       ]
     }
   }
   ```
   Set `multiple` to `false` to ensure labeler can only choose one answer
4. `CHECKBOX`
   ```json
   {
     "config": {
       "hint": "Description, or hint will be displayed here"
     }
   }
   ```
5. `DATE` / `TIME`

   ```json
   {
     "type": "DATE",
     "config": {
       "format": "DD/MM/YYYY",
       "defaultValue": null / "NOW"
     }
   }
   ```

   ```json
   {
     "type": "TIME",
     "config": {
       "format": "HH:mm",
       "defaultValue": "NOW"
     }
   }
   ```

   For `DATE` `format`, here are a few choices:

   1. `DD/MM/YYYY`
   2. `MM/DD/YYYY`
   3. `YYYY/MM/DD`

   For `TIME` `format`, here are a few guidelines:

   1. `HH` Hours, in 24-hour format, 00-23
   2. `hh` Hours, in 12-hour format, 01-12
   3. `mm` Minutes, 00-59
   4. `ss` Seconds, 00-59
   5. `A` adds `AM` / `PM`
   6. `.` or `:` as separator

   Examples: `hh:mm:ss A`, `HH:mm:ss`
