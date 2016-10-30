Sub main()

    Application.Calculation = xlCalculationAutomatic

    calculateAnalysisResult
    calculateFinalResult

End Sub

Function calculateAnalysisResult()

    Application.ScreenUpdating = False
    Worksheets("Analysis Result").Range("A2:Z6557").ClearContents
    Application.ScreenUpdating = True

    'Declaration of Variables
    Dim counterYear As Integer
    Dim counterMonth As Integer
    Dim rowIndex As Integer
    Dim rowIndexStress As Integer

    'Initialization of Variables
    rowIndex = 2
    rowIndexStress = 9

    'First Month
    Cells(rowIndex, 1) = 1
    Cells(rowIndex, 2) = Cells(rowIndex, 1).Value / 12
    Cells(rowIndex, 3) = Sheets("Input").Range("F8").Value
    Cells(rowIndex, 4) = 57000 / 7.5 * Cells(rowIndex, 3) / 1000
    Cells(rowIndex, 5) = Sheets("Stress").Cells(rowIndexStress, 38).Value
    Cells(rowIndex, 6) = Sheets("Stress").Cells(rowIndexStress, 39).Value * Cells(rowIndex, 4).Value / 5000
    Cells(rowIndex, 7) = Cells(rowIndex, 5).Value + Cells(rowIndex, 6).Value
    Cells(rowIndex, 8) = Cells(rowIndex, 7).Value / Cells(rowIndex, 3).Value
    Cells(rowIndex, 9) = 11800 * Cells(rowIndex, 8).Value ^ fatigue(Sheets("Input").Range("F19").Value)
    Cells(rowIndex, 10) = lane(Sheets("Input").Range("C24").Value) * Sheets("Input").Range("C25").Value * 1000000 / 12 / Sheets("Input").Range("C18").Value
    Cells(rowIndex, 11) = Cells(rowIndex, 10).Value / Cells(rowIndex, 9).Value
    Cells(rowIndex, 12) = Cells(rowIndex, 11).Value
    Cells(rowIndex, 13) = 18.985 / (1 + 5 * Cells(rowIndex, 12).Value ^ -1.1)

    'For Rest of Months
    For counterYear = 1 To Sheets("Input").Range("C18").Value
        If counterYear <> 1 Then
            rowIndexStress = 8
        End If
        For counterMonth = 1 To 12
            If counterYear = 1 And counterMonth = 1 Then
                'If First Year than Omit Calculation of First Month, Already Done
            Else
                'Else Run for All 12 Months of Year
                rowIndex = rowIndex + 1
                rowIndexStress = rowIndexStress + 1
                Cells(rowIndex, 1) = Cells(rowIndex - 1, 1) + 1
                Cells(rowIndex, 2) = Cells(rowIndex, 1).Value / 12
                Cells(rowIndex, 3) = Sheets("Input").Range("F8").Value * ((30 * Cells(rowIndex, 1).Value / (4 + 0.85 * 30 * Cells(rowIndex, 1).Value))) ^ 0.5
                Cells(rowIndex, 4) = 57000 / 7.5 * Cells(rowIndex, 3) / 1000
                Cells(rowIndex, 5) = Sheets("Stress").Cells(rowIndexStress, 38).Value
                Cells(rowIndex, 6) = Sheets("Stress").Cells(rowIndexStress, 39).Value * Cells(rowIndex, 4) / 5000
                Cells(rowIndex, 7) = Cells(rowIndex, 5).Value + Cells(rowIndex, 6).Value
                Cells(rowIndex, 8) = Cells(rowIndex, 7).Value / Cells(rowIndex, 3).Value
                Cells(rowIndex, 9) = 11800 * Cells(rowIndex, 8).Value ^ fatigue(Sheets("Input").Range("F19").Value)
                Cells(rowIndex, 10) = Cells(rowIndex - 1, 10).Value
                Cells(rowIndex, 11) = Cells(rowIndex, 10).Value / Cells(rowIndex, 9).Value
                Cells(rowIndex, 12) = Cells(rowIndex - 1, 12).Value + Cells(rowIndex, 11).Value
                Cells(rowIndex, 13) = 18.985 / (1 + 5 * Cells(rowIndex, 12).Value ^ -1.1)
                If rowIndexStress = 13 Then
                    rowIndexStress = 1
                End If
            End If
        Next counterMonth
    Next counterYear

End Function

Function calculateFinalResult()

    Application.ScreenUpdating = False
    Worksheets("Final Result").Range("A2:Z6557").ClearContents
    Application.ScreenUpdating = True

    'Write Header
    Worksheets("Final Result").Range("B3") = " INPUT DATA"
    Worksheets("Final Result").Range("B28") = " CRCP PERFORMANCE"
    Worksheets("Final Result").Range("B30") = " Number of Punchouts per Mile"

    'Copy Input Data
    Application.ScreenUpdating = False
    Worksheets("Final Result").Range("A5:F25") = Worksheets("Input").Range("A5:F25").Value
    Worksheets("Final Result").Range("C30") = Worksheets("Analysis Result").Cells(12 * Worksheets("Input").Range("C18").Value + 1, 13).Value
    Worksheets("Final Result").Range("C3") = Worksheets("Analysis Result").Cells(12 * Worksheets("Input").Range("C18").Value + 1, 13).Value
    If Worksheets("Final Result").Range("C30") <= Worksheets("Input").Range("C19").Value Then
        Worksheets("Final Result").Range("C30").Interior.Color = RGB(0, 255, 0)
    Else
        Worksheets("Final Result").Range("C30").Interior.Color = RGB(255, 0, 0)
    End If

    Sheets("Final Result").Activate

End Function

Function lane(n) As Double

    If n <= 2 Then
        lane = 1
    ElseIf n >= 4 Then
        lane = 0.6
    Else
        lane = 0.7
    End If

End Function

Function fatigue(k) As Double

    If k < 200 Then
        fatigue = k * 0.0221 - 15.97
    ElseIf k < 300 Then
        fatigue = k * 0.0164 - 14.83
    ElseIf k < 500 Then
        fatigue = k * 0.0038 - 11.05
    ElseIf k < 1000 Then
        fatigue = k * 0.00033 - 9.31
    Else
        fatigue = k * 0.00071 - 9.69
    End If

End Function
